/**
 * Takes the preview pictures of the home page cards: `bun run thumbnails`.
 *
 * Starts a Vite dev server, opens every homework in the installed Chrome and saves a 16:10
 * WebP to src/assets/thumbnails/ of the page of every homework.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium, type Page } from 'playwright-core'
import { createServer } from 'vite'
import { homeworkList } from '../src/homeworkList.ts'

const OUT_DIR = new URL('../src/assets/thumbnails/', import.meta.url)
const VIEWPORT = { width: 1280, height: 800 }
// A narrower window for the JavaScript pages: they are smaller, so they show bigger.
const JS_VIEWPORT = { width: 1024, height: 640 }
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
  // The first question of the quiz instead of the start screen.
  '08-quiz-game': async (page) => {
    await page.getByRole('button', { name: 'Start new game' }).click()
  },
  // A few open folders of the file tree.
  '13-dom-file-tree': async (page) => {
    await page.getByRole('button', { name: /Grow/ }).click()
    await page.getByRole('button', { name: /English/ }).click()
  },
  // A book with its funny cover in the preview.
  '15-bom-books': async (page) => {
    await page
      .getByRole('link', { name: /Life in EPAM/ })
      .first()
      .click()
    await page.waitForLoadState('networkidle')
  },
}

try {
  for (const homework of homeworkList) {
    console.log(`${homework.slug}`)
    const page = await browser.newPage({
      viewport: homework.kind === 'html-css' ? VIEWPORT : JS_VIEWPORT,
    })
    await page.goto(new URL(homework.page.src, base).href, { waitUntil: 'networkidle' })
    await setup[homework.slug]?.(page)
    await page.evaluate(() => document.fonts.ready)
    await save(page, homework.slug, await page.screenshot())
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}
