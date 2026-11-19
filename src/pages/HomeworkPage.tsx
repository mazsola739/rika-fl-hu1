import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { FileTextIcon } from '../components/icons'
import { LegacyFrame } from '../components/LegacyFrame'
import { SampleGallery } from '../components/SampleGallery'
import { CourseMark, Deadline, Sheet, SheetSection, SheetTitle } from '../components/sheet'
import { cx } from '../components/ui'
import {
  courseName,
  findHomework,
  formatDeadline,
  formatNumber,
  type Homework,
  homeworkList,
} from '../homeworkList'
import { taskSamples } from '../taskSamples'
import { taskSheetUrl } from '../taskSheets'
import { NotFoundPage } from './NotFoundPage'

export function HomeworkPage() {
  const { slug } = useParams()
  const homework = findHomework(slug)

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to the top whenever the homework changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!homework) {
    return <NotFoundPage />
  }

  const sheetUrl = taskSheetUrl(homework.number)
  const samples = taskSamples(homework.number)

  return (
    <article>
      <title>{`${formatNumber(homework.number)} ${homework.title} – FL-HU1`}</title>

      <PrevNext homework={homework} placement="top" />

      <Sheet className="mt-4">
        <SheetTitle overline={`${courseName(homework.number)} · ${homework.topic}`}>
          {homework.title}
        </SheetTitle>
        <Deadline>{formatDeadline(homework.deadline)}</Deadline>
        <p className="mt-5 max-w-3xl text-slate-700 dark:text-slate-300">{homework.summary}</p>

        <SheetSection title="Task">
          <ul className="max-w-3xl list-disc space-y-1 pl-5 text-[0.95rem] text-slate-800 dark:text-slate-200">
            {homework.task.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {(sheetUrl || samples.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-link hover:underline"
                >
                  <FileTextIcon className="text-lg" />
                  Original task sheet ({courseName(homework.number)}.pdf)
                </a>
              )}
              {samples.length > 0 && (
                <SampleGallery samples={samples} title={`${homework.title} – samples`} />
              )}
            </div>
          )}
        </SheetSection>

        <SheetSection title="My solution">
          {/* key: a fresh frame for every homework, so the screen width and the theme of one page
              do not carry over to the next (e.g. HW03's Day/Night). */}
          <Solution key={homework.slug} homework={homework} />
        </SheetSection>

        <footer className="mt-12">
          <CourseMark />
        </footer>
      </Sheet>

      <PrevNext homework={homework} placement="bottom" />
    </article>
  )
}

/** The original page of a homework, embedded with its screen width (and theme) switch. */
function Solution({ homework }: { homework: Homework }) {
  return (
    <>
      {homework.kind === 'javascript' && (
        <p className="mb-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          My original solution from the course, cleaned up in 2026 at the level the course taught:
          plain HTML, CSS and JavaScript, no framework, no build step.
        </p>
      )}
      {/* #demo: the part of the page the card thumbnails show (scripts/thumbnails.ts). */}
      <div id="demo">
        <LegacyFrame page={homework.page} title={homework.title} />
      </div>
    </>
  )
}

/** Previous homework, all homework and next homework: above and below the sheet. */
function PrevNext({ homework, placement }: { homework: Homework; placement: 'top' | 'bottom' }) {
  const index = homeworkList.indexOf(homework)
  const previous = homeworkList[index - 1]
  const next = homeworkList[index + 1]

  return (
    <nav
      aria-label={placement === 'top' ? 'Homework navigation' : 'Homework navigation, bottom'}
      className={cx(
        'grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm font-semibold',
        placement === 'bottom' && 'mt-12 border-t border-slate-200 pt-6 dark:border-slate-800',
      )}
    >
      <span>
        {previous && (
          <Link to={`/hw/${previous.slug}`} className="text-link hover:underline">
            ← {formatNumber(previous.number)} {previous.title}
          </Link>
        )}
      </span>
      <Link to="/" className="text-link hover:underline">
        All homework
      </Link>
      <span className="text-right">
        {next && (
          <Link to={`/hw/${next.slug}`} className="text-link hover:underline">
            {formatNumber(next.number)} {next.title} →
          </Link>
        )}
      </span>
    </nav>
  )
}
