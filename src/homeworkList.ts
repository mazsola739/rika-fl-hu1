export interface LegacyPage {
  /** Path of the original static page, relative to the site root (served from public/). */
  src: string
  /** Alternative stylesheets the page can be switched to (homework 03 has two themes). */
  themes?: { label: string; stylesheet: string }[]
  /**
   * The narrowest screen a desktop-only page was built for. Narrower previews lay it out at this
   * width and scale it down instead of cutting it off. Responsive pages leave it out.
   */
  minWidth?: number
}

export interface Homework {
  number: number
  slug: string
  title: string
  topic: string
  /** Deadline on the original task sheet, as an ISO date. */
  deadline: string
  summary: string
  /** The original requirements, in short. */
  task: string[]
  /**
   * `html-css`: the original page, as it was built. `javascript`: the original vanilla JS solution,
   * cleaned up in 2026 at the level the course taught (plain HTML, CSS and JS, no build step).
   */
  kind: 'html-css' | 'javascript'
  /** The page of the solution, embedded in the homework page. */
  page: LegacyPage
}

export const homeworkList: Homework[] = [
  {
    number: 1,
    deadline: '2021-03-08',
    slug: '01-html-basics',
    title: 'HTML Basics',
    topic: 'HTML',
    summary: 'A page built from HTML tags and attributes only, with working in-page navigation.',
    task: [
      'Recreate the provided screenshot with HTML tags and attributes only – writing CSS is not allowed.',
      'Use the given text content; the navigation menu has to jump to the sections.',
      'The markup has to pass the W3C validator.',
    ],
    kind: 'html-css',
    page: { src: 'legacy/01-html-basics/index.html', minWidth: 980 },
  },
  {
    number: 2,
    deadline: '2021-03-10',
    slug: '02-css-basics',
    title: 'CSS Basics',
    topic: 'CSS',
    summary:
      'Styling a given page without touching its HTML: specificity, hover and focus effects.',
    task: [
      'Style the page to match the example without editing index.html, general.css or bootstrap.min.css.',
      'Hover effects: text color and a corner triangle on sections 1–3, button colors, image zoom.',
      'Pricing plans get a shadow on hover; the special discount only shows on hover.',
      'Focus styles for every form field.',
    ],
    kind: 'html-css',
    page: { src: 'legacy/02-css-basics/index.html' },
  },
  {
    number: 3,
    deadline: '2021-03-13',
    slug: '03-preprocessors',
    title: 'Preprocessors',
    topic: 'SCSS',
    summary: 'One SCSS source compiled into a day and a night theme.',
    task: [
      'Generate style1.css and style2.css from the same SCSS sources to match two designs.',
      'Rules go to _main.scss, colors and fonts to _variables1.scss and _variables2.scss.',
      'Use nesting, mixins for links and buttons, at least one @extend and at least one map.',
    ],
    kind: 'html-css',
    page: {
      src: 'legacy/03-preprocessors/index.html',
      minWidth: 1240,
      themes: [
        { label: 'Day', stylesheet: 'css/style1.css' },
        { label: 'Night', stylesheet: 'css/style2.css' },
      ],
    },
  },
  {
    number: 4,
    deadline: '2021-03-15',
    slug: '04-css-layouts',
    title: 'CSS Layouts',
    topic: 'CSS layout',
    summary: 'A semantic landing page with a full-height header, built from a design mockup.',
    task: [
      'Build the page from the design using HTML5 semantic elements, without frameworks or JavaScript.',
      'The page must not break on screens 900px and wider.',
      'The header fills the full height of the browser window.',
      'The e-mail address in the footer is a live mailto link with a hover state.',
    ],
    kind: 'html-css',
    page: { src: 'legacy/04-css-layouts/index.html', minWidth: 900 },
  },
  {
    number: 5,
    deadline: '2021-03-17',
    slug: '05-responsive',
    title: 'Responsive',
    topic: 'Media queries',
    summary: 'A travel blog with desktop, tablet and mobile layouts.',
    task: [
      'Desktop (≥ 1280px), tablet (≥ 768px) and mobile layouts with pure CSS in one file.',
      'Posts alternate the side of the image and the description using pseudo-classes, not hardcoded classes.',
      'Animated hover effects for the menu, the posts and the "Learn more" buttons.',
      'A sandwich icon replaces the menu on tablet and mobile.',
    ],
    kind: 'html-css',
    page: { src: 'legacy/05-responsive/index.html' },
  },
  {
    number: 6,
    deadline: '2021-03-22',
    slug: '06-bootstrap',
    title: 'CSS Frameworks',
    topic: 'Bootstrap',
    summary: 'A responsive Bootstrap 4 page with a working burger menu.',
    task: [
      'Use Bootstrap 4.5 from a CDN; positioning and responsiveness with Bootstrap classes only.',
      'Custom CSS is allowed only for colors and fonts.',
      'Breakpoints: mobile < 768px, tablet < 992px, desktop ≥ 992px; burger menu on tablet and mobile.',
    ],
    kind: 'html-css',
    page: { src: 'legacy/06-bootstrap/index.html' },
  },
  {
    number: 7,
    deadline: '2021-03-24',
    slug: '07-intro-to-js',
    title: 'Intro to JS',
    topic: 'JavaScript basics',
    summary: 'Defective battery calculator and the middle character of a word.',
    task: [
      'Batteries: read the amount and the defective percentage, validate them, then show the amount of defective and working batteries with at most 2 decimals.',
      'Invalid input (not a number, negative amount, percentage outside 0–100) shows "Invalid input data".',
      'Middle character: odd length → the middle character, even length → the middle two, or "Middle characters are the same".',
      'Empty or whitespace-only input shows "Invalid value".',
    ],
    kind: 'javascript',
    page: { src: 'legacy/07-intro-to-js/index.html' },
  },
  {
    number: 8,
    deadline: '2021-03-27',
    slug: '08-quiz-game',
    title: 'Quiz game',
    topic: 'Debugging',
    summary: 'A "Who Wants to Be a Millionaire?" style quiz with doubling prizes.',
    task: [
      'A "Start new game" button starts the game; every round shows a random question with 4 answers.',
      'A question cannot repeat within one game.',
      'The prize starts at 100, is added to the total on a correct answer and then doubles.',
      'One "Skip question" per game.',
      'A wrong answer ends the game ("Game over. Your prize is: …"); reaching 1,000,000 wins.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/08-quiz-game/index.html' },
  },
  {
    number: 9,
    deadline: '2021-03-29',
    slug: '09-data-types',
    title: 'Data types',
    topic: 'Arrays, strings, dates',
    summary: 'Array and string helpers written without built-in methods.',
    task: [
      'Eleven helpers: convert, executeforEach, mapArray, filterArray, getValuePosition, flipOver, makeListFromRange, getArrayOfKeys, getTotalWeight, getPastDay, formatDate.',
      'Built-in array, object and string methods are forbidden, except push, length, parseInt and Date methods.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/09-data-types/index.html' },
  },
  {
    number: 10,
    deadline: '2021-03-31',
    slug: '10-functions',
    title: 'Functions',
    topic: 'Functions',
    summary: 'Small functions and a championship point counter, without the Math object.',
    task: [
      'Seven functions: isEquals, numberToString, storeNames, getDivision, negativeCount, letterCount, countPoints.',
      'Using the Math object is forbidden.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/10-functions/index.html' },
  },
  {
    number: 11,
    deadline: '2021-04-06',
    slug: '11-errors-storage',
    title: 'Errors and storage',
    topic: 'Errors, localStorage',
    summary: 'A page visit counter in localStorage and a calculator with its own parser.',
    task: [
      'Count in localStorage how many times each page link was clicked; "View results" lists the counts and clears the storage.',
      'Calculator: evaluate a mathematical expression; on error show a message and ask again.',
      'Expressions that result in NaN (e.g. 0/0) count as errors too.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/11-errors-storage/index.html' },
  },
  {
    number: 12,
    deadline: '2021-04-09',
    slug: '12-dates-regex',
    title: 'Dates and regular expressions',
    topic: 'Date, RegExp',
    summary: 'Date helpers and regular expression validators.',
    task: [
      'Date helpers: getAge, getWeekDay, getProgrammersDay (256th day of the year), howFarIs.',
      'Regular expressions: isValidIdentifier, capitalize, isValidAudioFile, getHexadecimalColors, isValidPassword, addThousandsSeparators.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/12-dates-regex/index.html' },
  },
  {
    number: 13,
    deadline: '2021-04-12',
    slug: '13-dom-file-tree',
    title: 'DOM',
    topic: 'DOM',
    summary: 'A file tree with folders, a custom context menu, rename and delete.',
    task: [
      'Build a file tree from the given data; folders are closed by default and toggle by clicking anywhere in their row.',
      'A subfolder keeps its state when its parent is closed and reopened.',
      'A custom right-click menu with Rename and Delete; the item is highlighted while the menu is open, and both options are disabled outside an item.',
      'Renaming selects the name without the extension; deleting the last item shows "Folder is empty".',
      'Clicking outside the menu closes it.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/13-dom-file-tree/index.html' },
  },
  {
    number: 14,
    deadline: '2021-04-14',
    slug: '14-dom-events',
    title: 'DOM events',
    topic: 'Events',
    summary: 'Color-toggling table, phone number validation and a basketball court.',
    task: [
      'Table: a cell toggles yellow, the first column toggles its row blue, the special cell toggles the whole table green; priority yellow > blue > green.',
      'Phone field: valid format is +380 followed by 9 digits; invalid input disables "Send", turns the border red and shows a message; sending shows a success message.',
      'Basketball: a 600×330 court, the ball moves to the click; the 15×15 scoring zones dispatch a custom event that updates the score and shows a notification for 3 seconds.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/14-dom-events/index.html' },
  },
  {
    number: 15,
    deadline: '2021-04-17',
    slug: '15-bom-books',
    title: 'BOM',
    topic: 'History, localStorage',
    summary: 'An editable book list with URL routing and localStorage persistence.',
    task: [
      'A list of books with an edit button each and an add button; the other section shows a preview, an edit form or an add form depending on the URL.',
      'Forms have four required fields; Cancel asks "Discard changes?", Save stores the book, opens its preview and shows a success message after 200ms.',
      'Changes survive a page refresh (localStorage); an invalid URL shows the list; browser back and forward work.',
    ],
    kind: 'javascript',
    page: { src: 'legacy/15-bom-books/index.html' },
  },
]

export function findHomework(slug: string | undefined) {
  return homeworkList.find((homework) => homework.slug === slug)
}

export function formatNumber(number: number) {
  return `HW ${String(number).padStart(2, '0')}`
}

/** A date as the task sheets write it: 08/03/2021. */
export function formatDeadline(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

/** The folder name of the homework in the course, as on its task sheet: FL1_HW7. */
export function courseName(number: number) {
  return `FL1_HW${number}`
}
