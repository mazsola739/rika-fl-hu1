import { Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { FileTextIcon } from '../components/icons'
import { LegacyFrame } from '../components/LegacyFrame'
import { CourseMark, Deadline, Sheet, SheetSection, SheetTitle } from '../components/sheet'
import { cx } from '../components/ui'
import { reactHomework } from '../homework'
import {
  courseName,
  findHomework,
  formatDeadline,
  formatNumber,
  type Homework,
  homeworkList,
} from '../homeworkList'
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

  const Component = reactHomework[homework.slug]
  const sheetUrl = taskSheetUrl(homework.number)

  return (
    <article>
      <title>{`${formatNumber(homework.number)} ${homework.title} – FL-HU1`}</title>

      <PrevNext homework={homework} placement="top" />

      <Sheet className="mt-4">
        <SheetTitle overline={`${courseName(homework.number)} · ${homework.topic}`}>
          {homework.title}
        </SheetTitle>
        <Deadline>{formatDeadline(homework.deadline)}</Deadline>
        <p className="mt-6 max-w-3xl text-lg text-slate-700 dark:text-slate-300">
          {homework.summary}
        </p>

        <SheetSection title="Task">
          <ul className="max-w-3xl list-disc space-y-1.5 pl-5 text-[1.05rem] text-slate-800 dark:text-slate-200">
            {homework.task.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {sheetUrl && (
            <p className="mt-5">
              <a
                href={sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-link hover:underline"
              >
                <FileTextIcon className="text-lg" />
                Original task sheet ({courseName(homework.number)}.pdf) ↗
              </a>
            </p>
          )}
        </SheetSection>

        {homework.reactNotes && (
          <SheetSection title="React version">
            <p className="max-w-3xl text-[1.05rem] text-slate-800 dark:text-slate-200">
              {homework.reactNotes}
            </p>
          </SheetSection>
        )}

        <SheetSection title="My solution">
          {/* #demo: the part of the page the card thumbnails show (scripts/thumbnails.ts). */}
          <div id="demo">
            {/* key: a fresh preview for every homework, so the screen width and the theme of one
                page do not carry over to the next (e.g. HW03's Day/Night switch). */}
            {homework.legacy && (
              <LegacyFrame key={homework.slug} page={homework.legacy} title={homework.title} />
            )}
            {Component && (
              <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
                <Component />
              </Suspense>
            )}
          </div>
        </SheetSection>

        <footer className="mt-12">
          <CourseMark />
        </footer>
      </Sheet>

      <PrevNext homework={homework} placement="bottom" />
    </article>
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
