/**
 * The sample pictures the course gave with the tasks (designs, screenshots of the expected result),
 * from the original task folders and task sheets: src/assets/task-samples/<NN>-<order>-<name>,
 * with a small preview of each in thumbs/.
 */
const images = import.meta.glob<string>('/src/assets/task-samples/*.{webp,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const thumbs = import.meta.glob<string>('/src/assets/task-samples/thumbs/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export interface TaskSample {
  src: string
  thumb: string
  caption: string
}

const CAPTIONS: Record<string, string> = {
  result: 'The expected result',
  final: 'The expected result',
  'design-day': 'Day design',
  'design-night': 'Night design',
  template: 'Design',
  footer: 'Footer',
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
  'hover-effects': 'Hover effects',
  game: 'A round of the game',
  'game-over': 'Game over',
  win: 'Winning the game',
  results: 'Visit results',
  tree: 'The file tree',
  animation: 'The context menu in action',
  table: 'Table colors',
  'phone-invalid': 'Invalid phone number',
  'phone-sent': 'Data sent',
  court: 'The court',
  'court-ball': 'The ball moves to the click',
  'court-team-b': 'Team B scores',
  'court-team-a': 'Team A scores',
}

function captionOf(name: string) {
  const detail = /^detail-(\d+)$/.exec(name)
  if (detail) {
    return `Detail ${Number(detail[1])}`
  }

  return CAPTIONS[name] ?? name
}

/** The sample pictures of a homework, in order; empty when the task had none. */
export function taskSamples(number: number): TaskSample[] {
  const prefix = `${String(number).padStart(2, '0')}-`
  return Object.entries(images)
    .map(([path, src]) => ({ path, src, file: path.split('/').at(-1) ?? '' }))
    .filter(({ file }) => file.startsWith(prefix))
    .sort((a, b) => a.file.localeCompare(b.file))
    .map(({ src, file }) => {
      const base = file.replace(/\.\w+$/, '')
      return {
        src,
        thumb: thumbs[`/src/assets/task-samples/thumbs/${base}.webp`] ?? src,
        caption: captionOf(base.replace(/^\d+-\d+-/, '')),
      }
    })
}
