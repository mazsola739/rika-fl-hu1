import { Link } from 'react-router'
import { formatNumber, type Homework, homeworkList } from '../homeworkList'

const sections = [
  {
    title: 'HTML & CSS',
    description:
      'The original pages, as they were built for the course: no framework, no build step.',
    items: homeworkList.filter((homework) => homework.kind === 'legacy'),
  },
  {
    title: 'JavaScript → React',
    description: 'The JavaScript tasks, rebuilt with React 19 and TypeScript, with unit tests.',
    items: homeworkList.filter((homework) => homework.kind === 'react'),
  },
]

export function HomePage() {
  return (
    <>
      <title>FL-HU1 – Front-end Lab homework</title>

      <section className="mb-10 max-w-3xl">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Front-end Lab homework
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          My first bigger learning project: the 15 homework tasks of the EPAM Front-end Lab, from
          HTML basics to routing with the History API.
        </p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="text-xl font-bold">{section.title}</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">{section.description}</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((homework) => (
              <li key={homework.slug}>
                <HomeworkCard homework={homework} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

function HomeworkCard({ homework }: { homework: Homework }) {
  return (
    <Link
      to={`/hw/${homework.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="mb-1 text-xs font-semibold tracking-wider text-accent uppercase">
        {formatNumber(homework.number)} · {homework.topic}
      </span>
      <span className="mb-2 text-lg font-semibold group-hover:text-accent">{homework.title}</span>
      <span className="text-sm text-slate-600 dark:text-slate-400">{homework.summary}</span>
    </Link>
  )
}
