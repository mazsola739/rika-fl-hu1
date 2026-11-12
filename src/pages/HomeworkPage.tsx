import { Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { LegacyFrame } from '../components/LegacyFrame'
import { reactHomework } from '../homework'
import { findHomework, formatNumber, type Homework, homeworkList } from '../homeworkList'
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

  return (
    <article>
      <title>{`${formatNumber(homework.number)} ${homework.title} – FL-HU1`}</title>

      <Link to="/" className="text-sm font-semibold text-accent hover:underline">
        ← All homework
      </Link>

      <header className="mt-4 mb-6 max-w-3xl">
        <p className="text-sm font-semibold tracking-wider text-accent uppercase">
          {formatNumber(homework.number)} · {homework.topic}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{homework.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{homework.summary}</p>
      </header>

      <details className="mb-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary className="cursor-pointer font-semibold">The task</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {homework.task.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {homework.reactNotes && (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            <strong className="font-semibold">React version:</strong> {homework.reactNotes}
          </p>
        )}
      </details>

      {homework.legacy && <LegacyFrame page={homework.legacy} title={homework.title} />}
      {Component && (
        <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
          <Component />
        </Suspense>
      )}

      <PrevNext homework={homework} />
    </article>
  )
}

function PrevNext({ homework }: { homework: Homework }) {
  const index = homeworkList.indexOf(homework)
  const previous = homeworkList[index - 1]
  const next = homeworkList[index + 1]

  return (
    <nav className="mt-12 flex justify-between gap-4 border-t border-slate-200 pt-6 text-sm font-semibold dark:border-slate-800">
      {previous ? (
        <Link to={`/hw/${previous.slug}`} className="text-accent hover:underline">
          ← {formatNumber(previous.number)} {previous.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={`/hw/${next.slug}`} className="text-accent hover:underline">
          {formatNumber(next.number)} {next.title} →
        </Link>
      )}
    </nav>
  )
}
