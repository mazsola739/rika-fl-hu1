import { useCallback, useEffect, useRef, useState } from 'react'
import type { LegacyPage } from '../homeworkList'
import { cx } from './ui'

const DEVICES = [
  { label: 'Desktop', width: undefined },
  { label: 'Tablet', width: 768 },
  { label: 'Mobile', width: 375 },
] as const

type Device = (typeof DEVICES)[number]

/** Embeds an original static homework page, with device width and theme switchers. */
export function LegacyFrame({ page, title }: { page: LegacyPage; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<Device>(DEVICES[0])
  const [theme, setTheme] = useState(page.themes?.[0])

  // The iframe is same-origin, so the theme switch can simply swap the stylesheet link.
  const applyTheme = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    if (!doc || !theme || !page.themes) {
      return
    }
    const links = doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
    for (const link of links) {
      const href = link.getAttribute('href') ?? ''
      if (page.themes.some(({ stylesheet }) => href === stylesheet)) {
        link.setAttribute('href', theme.stylesheet)
      }
    }
  }, [page.themes, theme])

  useEffect(applyTheme, [applyTheme])

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
          href={page.src}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-sm font-semibold text-accent hover:underline"
        >
          Open in a new tab ↗
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-200 p-2 dark:border-slate-800 dark:bg-slate-800">
        <iframe
          ref={frameRef}
          src={page.src}
          title={title}
          onLoad={applyTheme}
          className="mx-auto block h-[75vh] min-h-[480px] rounded-lg bg-white transition-[width]"
          style={{ width: device.width ?? '100%' }}
        />
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
