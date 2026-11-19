/**
 * The original task sheets (PDFs) of the course, in course-tasks/: the build includes them and
 * every homework links its own sheet. A homework without a sheet simply has no link.
 */
const sheets = import.meta.glob<string>('/course-tasks/FL1_HW*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** URL of the task sheet of a homework, or undefined when it has none. */
export function taskSheetUrl(number: number): string | undefined {
  return sheets[`/course-tasks/FL1_HW${String(number).padStart(2, '0')}.pdf`]
}
