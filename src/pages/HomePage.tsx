import { Link } from 'react-router'
import { Deadline, Sheet, SheetTitle } from '../components/sheet'
import { courseName, formatDeadline, type Homework, homeworkList } from '../homeworkList'

// Card pictures, taken by scripts/thumbnails.ts: `<slug>.webp`, and `<slug>-dark.webp` for the
// React homework, which follow the site's theme.
const thumbnails = import.meta.glob<string>('../assets/thumbnails/*.webp', {
  eager: true,
  import: 'default',
})

const thumbnail = (slug: string, variant = '') =>
  thumbnails[`../assets/thumbnails/${slug}${variant}.webp`]

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

const first = homeworkList[0] as Homework
const last = homeworkList.at(-1) as Homework

export function HomePage() {
  return (
    <>
      <title>FL-HU1 – Front-end Lab homework</title>

      {/* The cover sheet, in the style of the course's task sheets. */}
      <Sheet className="mb-12">
        <SheetTitle overline="EPAM Front-end Lab · FL-HU1">Front-end Lab homework</SheetTitle>
        <Deadline label="DEADLINES:">
          {formatDeadline(first.deadline)} – {formatDeadline(last.deadline)}
        </Deadline>
        <p className="mt-6 max-w-3xl text-lg text-slate-700 dark:text-slate-300">
          My first bigger learning project: the homework of the EPAM Front-end Lab (FL-HU1,
          2020–2021), the course where EPAM’s trainers taught me front-end development. Their 15
          tasks go from HTML basics to routing with the History API; the solutions are mine.
        </p>
      </Sheet>

      {sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="text-xl font-bold tracking-wide text-sheet-heading uppercase">
            {section.title}
          </h2>
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
  const light = thumbnail(homework.slug)
  const dark = thumbnail(homework.slug, '-dark')
  const image =
    'aspect-16/10 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]'

  return (
    <Link
      to={`/hw/${homework.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Decorative preview: the card's text already says what is behind it. */}
      {light && (
        <span className="block overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <img
            src={light}
            alt=""
            loading="lazy"
            className={`${image} ${dark ? 'dark:hidden' : ''}`}
          />
          {dark && (
            <img src={dark} alt="" loading="lazy" className={`${image} hidden dark:block`} />
          )}
        </span>
      )}
      <span className="flex flex-1 flex-col p-5">
        <span className="mb-1 font-mono text-xs text-slate-500 dark:text-slate-400">
          {courseName(homework.number)} · {homework.topic}
        </span>
        <span className="mb-2 text-xl leading-tight font-bold text-sheet-title group-hover:text-link">
          {homework.title}
        </span>
        <span className="text-slate-600 dark:text-slate-400">{homework.summary}</span>
        <span className="mt-auto pt-3 text-sm">
          <span className="font-bold text-deadline">DEADLINE:</span>{' '}
          {formatDeadline(homework.deadline)}
        </span>
      </span>
    </Link>
  )
}
