import { Link } from 'react-router'
import { Deadline, Sheet, SheetTitle } from '../components/sheet'
import { courseName, formatDeadline, type Homework, homeworkList } from '../homeworkList'

// Card pictures of the original pages, taken by scripts/thumbnails.ts: `<slug>.webp`.
const thumbnails = import.meta.glob<string>('../assets/thumbnails/*.webp', {
  eager: true,
  import: 'default',
})

const thumbnail = (slug: string) => thumbnails[`../assets/thumbnails/${slug}.webp`]

const sections = [
  {
    title: 'HTML & CSS',
    description:
      'The original pages, as they were built for the course: no framework, no build step.',
    items: homeworkList.filter((homework) => homework.kind === 'html-css'),
  },
  {
    title: 'JavaScript',
    description:
      'My original solutions in plain JavaScript, cleaned up in 2026: still no framework, no build step.',
    items: homeworkList.filter((homework) => homework.kind === 'javascript'),
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
        <SheetTitle overline="Front-end Lab · FL-HU1">Front-end Lab homework</SheetTitle>
        <Deadline label="DEADLINES:">
          {formatDeadline(first.deadline)} – {formatDeadline(last.deadline)}
        </Deadline>
        <p className="mt-6 max-w-3xl text-lg text-slate-700 dark:text-slate-300">
          My first bigger learning project: the homework of Front-end Lab (FL-HU1, 2020–2021), the
          course where I learned front-end development. Its 15 tasks go from HTML basics to routing
          with the History API; the solutions are mine.
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
  const picture = thumbnail(homework.slug)
  const image =
    'aspect-16/10 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]'

  return (
    <Link
      to={`/hw/${homework.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Decorative preview: the card's text already says what is behind it. */}
      {picture && (
        <span className="block overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <img src={picture} alt="" loading="lazy" className={image} />
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
