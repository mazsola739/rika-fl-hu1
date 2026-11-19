import { useEffect, useRef, useState } from 'react'
import type { TaskSample } from '../taskSamples'
import { cx } from './ui'

/**
 * A "Samples" button that opens the sample pictures of a task in a popup (a modal <dialog>): the
 * picture big, with a strip of all the pictures below it. Esc or a click outside closes it, the
 * arrow keys step between the pictures.
 */
export function SampleGallery({ samples, title }: { samples: TaskSample[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const current = openIndex === null ? undefined : samples[openIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (current && !dialog.open) {
      dialog.showModal?.()
    } else if (!current && dialog.open) {
      dialog.close()
    }
  }, [current])

  const step = (direction: 1 | -1) =>
    setOpenIndex((index) =>
      index === null ? index : (index + direction + samples.length) % samples.length,
    )

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="inline-flex cursor-pointer items-center gap-2 font-semibold text-link hover:underline"
      >
        <ImagesIcon />
        Samples ({samples.length} {samples.length === 1 ? 'picture' : 'pictures'})
      </button>

      <dialog
        ref={dialogRef}
        aria-label={current ? `${title}: ${current.caption}` : title}
        onClose={() => setOpenIndex(null)}
        onKeyDown={handleKeyDown}
        // A click on the backdrop lands on the dialog itself, not on its content.
        onClick={(event) => event.target === event.currentTarget && setOpenIndex(null)}
        className="m-auto h-[92vh] w-[min(1200px,94vw)] overflow-hidden rounded-lg bg-white p-0 shadow-2xl backdrop:bg-black/70 dark:bg-slate-900"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-2 dark:border-slate-700">
              <p className="mr-auto font-semibold text-slate-800 dark:text-slate-100">
                {title}
                <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
                  {current.caption}
                  {samples.length > 1 && ` · ${(openIndex ?? 0) + 1} / ${samples.length}`}
                </span>
              </p>
              {samples.length > 1 && (
                <>
                  <GalleryButton label="Previous picture" onClick={() => step(-1)}>
                    ←
                  </GalleryButton>
                  <GalleryButton label="Next picture" onClick={() => step(1)}>
                    →
                  </GalleryButton>
                </>
              )}
              <a
                href={current.src}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-link hover:underline"
              >
                Full size
              </a>
              <GalleryButton label="Close" onClick={() => setOpenIndex(null)}>
                ✕
              </GalleryButton>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-slate-100 dark:bg-slate-950">
              <img src={current.src} alt={current.caption} className="mx-auto block max-w-full" />
            </div>

            {samples.length > 1 && (
              <ul className="flex gap-2 overflow-x-auto border-t border-slate-200 p-2 dark:border-slate-700">
                {samples.map((sample, index) => (
                  <li key={sample.src} className="shrink-0">
                    <button
                      type="button"
                      aria-label={sample.caption}
                      aria-current={index === openIndex}
                      title={sample.caption}
                      onClick={() => setOpenIndex(index)}
                      className={cx(
                        'block w-28 cursor-pointer overflow-hidden rounded border-2',
                        index === openIndex
                          ? 'border-accent'
                          : 'border-transparent opacity-70 hover:opacity-100',
                      )}
                    >
                      <img
                        src={sample.thumb}
                        alt=""
                        className="aspect-16/10 w-full object-cover object-top"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}

function GalleryButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-8 cursor-pointer place-items-center rounded-md text-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  )
}

/** Two stacked pictures, the icon of the samples button. */
function ImagesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.1em"
      height="1.1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="7" y="3" width="14" height="14" rx="1" />
      <path d="M3 7v13a1 1 0 0 0 1 1h13" />
      <path d="m7 13 4-4 6 6" />
    </svg>
  )
}
