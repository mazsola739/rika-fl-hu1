/**
 * Takes the preview pictures of the home page cards: `bun run thumbnails`.
 *
 * Starts a Vite dev server, opens every homework in the installed Chrome and saves a 16:10
 * WebP to src/assets/thumbnails/: the original page for the HTML and CSS homework, the demo
 * part of the page for the React homework (in a light and a dark version).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium, type Page } from 'playwright-core'
import { createServer } from 'vite'
import { homeworkList } from '../src/homeworkList.ts'

const OUT_DIR = new URL('../src/assets/thumbnails/', import.meta.url)
const VIEWPORT = { width: 1280, height: 800 }
const REACT_VIEWPORT = { width: 1024, height: 800 }
/** Width of the saved picture: a card is at most ~360px wide, so this is sharp on 2x screens too. */
const THUMBNAIL_WIDTH = 720

/** Scales a PNG screenshot down and encodes it as WebP, using the browser's own encoder. */
async function toWebp(page: Page, png: Buffer): Promise<Buffer> {
  const base64 = await page.evaluate(
    async ({ data, width }) => {
      const bytes = Uint8Array.from(atob(data), (char) => char.charCodeAt(0))
      const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
      const height = Math.round((bitmap.height * width) / bitmap.width)
      const canvas = new OffscreenCanvas(width, height)
      const context = canvas.getContext('2d')
      if (!context) throw new Error('No 2D canvas')
      context.imageSmoothingQuality = 'high'
      context.drawImage(bitmap, 0, 0, width, height)
      const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 })
      const buffer = new Uint8Array(await blob.arrayBuffer())
      let binary = ''
      for (const byte of buffer) binary += String.fromCharCode(byte)
      return btoa(binary)
    },
    { data: png.toString('base64'), width: THUMBNAIL_WIDTH },
  )
  return Buffer.from(base64, 'base64')
}

async function save(page: Page, name: string, png: Buffer) {
  const file = new URL(`${name}.webp`, OUT_DIR)
  await writeFile(file, await toWebp(page, png))
  console.log(`  ${name}.webp`)
}

const server = await createServer({ server: { port: 0 }, logLevel: 'error' })
await server.listen()
const base = server.resolvedUrls?.local[0]
if (!base) throw new Error('The Vite server has no local URL')

const browser = await chromium.launch({ channel: 'chrome' })
await mkdir(OUT_DIR, { recursive: true })

/** Steps before the picture of some homework, to show its best side. */
const setup: Record<string, (page: Page) => Promise<void>> = {
  // The calculator's easter egg.
  '11-errors-storage': async (page) => {
    await page.getByRole('textbox', { name: 'Enter a mathematical expression' }).fill('Rika')
    await page.keyboard.press('Enter')
    await page.getByText('Rika = priceless').waitFor()
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  },
  // A book with its funny cover in the preview.
  '15-bom-books': async (page) => {
    await page.getByRole('link', { name: 'Preview Life in EPAM' }).click()
    await page.getByRole('img', { name: 'Cover of Life in EPAM' }).waitFor()
    await page.waitForLoadState('networkidle')
  },
}

async function openPage(options: Parameters<typeof browser.newPage>[0], path: string) {
  const page = await browser.newPage(options)
  // Light is the default; the dark pictures need the dark theme saved, like after the switch.
  if (options?.colorScheme === 'dark') {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  }
  await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' })
  return page
}

try {
  for (const homework of homeworkList) {
    console.log(`${homework.slug}`)

    if (homework.legacy) {
      const page = await openPage({ viewport: VIEWPORT }, homework.legacy.src)
      await save(page, homework.slug, await page.screenshot())
      await page.close()
      continue
    }

    for (const theme of ['light', 'dark'] as const) {
      // A narrower window than for the original pages: the demos are smaller, so they show bigger.
      const page = await openPage(
        { viewport: REACT_VIEWPORT, colorScheme: theme },
        `#/hw/${homework.slug}`,
      )
      // Only the demo: a short one leaves empty background below, not the page navigation.
      await page.addStyleTag({
        content: '#demo ~ *, article > nav, footer { visibility: hidden !important; }',
      })
      const demo = page.locator('#demo')
      await demo.locator(':scope > *').first().waitFor()
      await setup[homework.slug]?.(page)
      // The setup may have scrolled: the clip below is measured from the top of the page.
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.evaluate(() => document.fonts.ready)
      const box = await demo.boundingBox()
      if (!box) throw new Error(`#demo of ${homework.slug} is not visible`)
      // A 16:10 frame from the top of the demo, with a small margin around it.
      const margin = 16
      const width = box.width + 2 * margin
      const clip = { x: box.x - margin, y: box.y - margin, width, height: (width * 10) / 16 }
      const png = await page.screenshot({ clip, fullPage: true })
      await save(page, theme === 'dark' ? `${homework.slug}-dark` : homework.slug, png)
      await page.close()
    }
  }
} finally {
  await browser.close()
  await server.close()
}
