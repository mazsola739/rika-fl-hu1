import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import type { LegacyPage } from '../homeworkList'
import { cx } from './ui'

// Desktop is a real desktop width (the desktop breakpoint of the responsive homework, HW05),
// not the width of the box: a narrower box shows it scaled down, like the other two.
const DEVICES = [
  { label: 'Desktop', width: 1280 },
  { label: 'Tablet', width: 768 },
  { label: 'Mobile', width: 375 },
] as const

type Device = (typeof DEVICES)[number]

type Theme = NonNullable<LegacyPage['themes']>[number]

/**
 * The original pages are same-origin and have no theme switch of their own (homework 03 swapped
 * its stylesheet by hand), so the preview applies a theme by swapping the stylesheet link.
 */
function applyStylesheet(doc: Document, themes: Theme[], theme: Theme) {
  const links = doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  for (const link of links) {
    const href = link.getAttribute('href') ?? ''
    if (themes.some(({ stylesheet }) => href === stylesheet)) {
      link.setAttribute('href', theme.stylesheet)
    }
  }
}

/**
 * Address of the page in a theme, for the new tab link: the first theme is the page as it is,
 * the others are picked with `?theme=` (the night theme of homework 03 is `?theme=night`).
 */
export function themedSrc(page: LegacyPage, theme: Theme | undefined) {
  const index = theme ? (page.themes?.indexOf(theme) ?? -1) : -1
  return theme && index > 0 ? `${page.src}?theme=${theme.label.toLowerCase()}` : page.src
}

/** Width of an element's content box, kept up to date; undefined until it is measured. */
function useContentWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState<number>()
  useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') {
      return
    }
    const observer = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return width
}

/** Embeds an original static homework page, with device width and theme switchers. */
export function LegacyFrame({ page, title }: { page: LegacyPage; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const boxWidth = useContentWidth(boxRef)
  const [device, setDevice] = useState<Device>(DEVICES[0])
  const [theme, setTheme] = useState(page.themes?.[0])

  const applyTheme = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    if (doc && page.themes && theme) {
      applyStylesheet(doc, page.themes, theme)
    }
  }, [page.themes, theme])

  useEffect(applyTheme, [applyTheme])

  // A classic scrollbar takes width from the page (overlay scrollbars on phones take none).
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  function handleLoad() {
    applyTheme()
    const frameWindow = frameRef.current?.contentWindow
    if (frameWindow) {
      setScrollbarWidth(frameWindow.innerWidth - frameWindow.document.documentElement.clientWidth)
    }
  }

  // The page is laid out at the width of the chosen screen, but never
  // narrower than it was built for: a desktop-only page is drawn at its own width and scaled down
  // to fit, the way a phone shows a desktop site. Wider screens than the box are scaled down too.
  const screenWidth = device.width ?? boxWidth
  const minLayoutWidth = page.minWidth === undefined ? 0 : page.minWidth + scrollbarWidth
  const layoutWidth = screenWidth && Math.max(screenWidth, minLayoutWidth)
  const displayWidth = screenWidth && boxWidth ? Math.min(screenWidth, boxWidth) : screenWidth
  const scale = layoutWidth && displayWidth ? displayWidth / layoutWidth : 1
  const scaledDown = screenWidth !== undefined && screenWidth < minLayoutWidth

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          label="Screen width"
          options={DEVICES}
          selected={device}
          onSelect={setDevice}
        />
        {page.themes && theme && (
          <ToggleGroup label="Theme" options={page.themes} selected={theme} onSelect={setTheme} />
        )}
        <a
          href={themedSrc(page, theme)}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-sm font-semibold text-link hover:underline"
        >
          Open in a new tab
        </a>
      </div>

      {scaledDown && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This page was built for screens at least {page.minWidth}px wide, so narrower previews show
          it scaled down instead of cutting it off.
        </p>
      )}

      <div
        ref={boxRef}
        className="rounded-2xl border border-slate-200 bg-slate-200 p-2 dark:border-slate-800 dark:bg-slate-800"
      >
        <div
          className="mx-auto h-[75vh] min-h-[480px] overflow-hidden rounded-lg bg-white transition-[width]"
          style={{ width: displayWidth ?? '100%' }}
        >
          <iframe
            ref={frameRef}
            src={page.src}
            title={title}
            onLoad={handleLoad}
            className="block origin-top-left"
            style={{
              width: layoutWidth ?? '100%',
              height: `${100 / scale}%`,
              transform: scale < 1 ? `scale(${scale})` : undefined,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ToggleGroup<T extends { label: string }>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: readonly T[]
  selected: T
  onSelect: (option: T) => void
}) {
  return (
    <fieldset className="flex rounded-lg border border-slate-300 p-0.5 dark:border-slate-700">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={option === selected}
          onClick={() => onSelect(option)}
          className={cx(
            'cursor-pointer rounded-md px-3 py-1 text-sm font-medium',
            option === selected
              ? 'bg-accent text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
          )}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
