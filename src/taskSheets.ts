/**
 * The original task sheets (PDFs) of the course. They are EPAM's material, so they stay in the
 * gitignored course-tasks/ folder: where that folder exists (locally) the build includes them and
 * every homework links its sheet; a build from the repository alone has no sheets and no links.
 */
const sheets = import.meta.glob<string>('/course-tasks/FL1_HW*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** URL of the task sheet of a homework, or undefined when the PDFs are not here. */
export function taskSheetUrl(number: number): string | undefined {
  return sheets[`/course-tasks/FL1_HW${String(number).padStart(2, '0')}.pdf`]
}
