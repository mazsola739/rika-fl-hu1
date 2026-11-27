# FL-HU1 – Front-end Lab homework

My first bigger learning project: the homework of the EPAM Front-end Lab (FL-HU1, 2020–2021), the course
where I learned front-end development. The 15 tasks are the course's, the solutions are mine – simple,
beginner solutions from my noob years, collected on one site in 2026.

**Live site:** https://mazsola739.github.io/rika-fl-hu1/

- **HTML & CSS (01–06)** run as the original static pages – writing plain HTML, CSS, Sass and
  Bootstrap was the point of those tasks.
- **JavaScript (07–15)** run as my original solutions in plain HTML, CSS and JavaScript, cleaned up
  in 2026 at the level the course taught (its lectures and ESLint rules): no framework, no build
  step, no `innerHTML`, no inline event handlers, and the restrictions of the task sheets kept (no
  built-in methods in 09, no `Math` in 10). The logic has Vitest tests.
- Every homework is embedded with a screen width switcher and can be opened in a new tab.
- The sample pictures the course gave with a task (designs, screenshots of the expected result)
  open in a popup from the **Samples** button under its description.
- Styled like the course's task sheets: Calibri (Carlito), a coral DEADLINE line, cyan section
  headings and the deadline of every homework. Light and dark theme.
- Easter egg: my name, Rika, is hidden in every homework.
- The footer links my portfolio, the repository and a **Contact me** form (sent by
  [Web3Forms](https://web3forms.com), like on my other project pages).

Part of my portfolio: https://mazsola739.github.io/mazsola739/

## Stack

- **The homework:** HTML, CSS, Sass, Bootstrap 4 and vanilla JavaScript (ES modules).
- **The site around it (2026):** [Bun](https://bun.sh) · [Vite](https://vite.dev) · React ·
  TypeScript · Tailwind CSS · React Router · [Biome](https://biomejs.dev) · Vitest

## Homework

| #   | Topic           | Version  | What it is                                                                          |
| --- | --------------- | -------- | ----------------------------------------------------------------------------------- |
| 01  | HTML Basics     | as built | A page built from HTML tags and attributes only, with in-page navigation.           |
| 02  | CSS Basics      | as built | Styling a given page without touching its HTML: specificity, hover and focus.       |
| 03  | Preprocessors   | as built | One SCSS source compiled into a day and a night theme.                              |
| 04  | CSS Layouts     | as built | Semantic landing page with a full-height header, built from a design.               |
| 05  | Responsive      | as built | Travel blog with desktop, tablet and mobile layouts.                                |
| 06  | CSS Frameworks  | as built | Responsive Bootstrap 4 page with a working burger menu.                             |
| 07  | Intro to JS     | cleaned  | Defective battery calculator and the middle character of a word.                    |
| 08  | Debugging       | cleaned  | "Who Wants to Be a Millionaire?" style quiz game.                                   |
| 09  | Data types      | cleaned  | Array and string helpers without built-in methods.                                  |
| 10  | Functions       | cleaned  | Small functions without the `Math` object.                                          |
| 11  | Errors, storage | cleaned  | Page visit counter in `localStorage` and a calculator with its own parser.          |
| 12  | Date, RegExp    | cleaned  | Date helpers and regular expression validators.                                     |
| 13  | DOM             | cleaned  | File tree with a custom context menu, rename and delete.                            |
| 14  | DOM events      | cleaned  | Color-toggling table, phone validation and a basketball court with a `CustomEvent`. |
| 15  | BOM             | cleaned  | Editable book list with routing, back/forward support and `localStorage`.           |

## Getting started

```bash
bun install
bun run dev
```

| Command              | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `bun run dev`        | Starts the Vite dev server.                                 |
| `bun run build`      | Type checks and builds the static site into `dist/`.        |
| `bun run preview`    | Serves the production build locally.                        |
| `bun run test`       | Runs the Vitest tests (`test:watch` for watch mode).        |
| `bun run typecheck`  | TypeScript check only.                                      |
| `bun run lint`       | Biome lint and format check (`format` applies the fixes).   |
| `bun run lint:ci`    | The same check without writing anything, for CI.            |
| `bun run build:hw03` | Recompiles the SCSS of homework 03 into its two CSS themes. |
| `bun run thumbnails` | Retakes the card pictures of the home page (needs Chrome).  |

The build uses a relative base and hash routing, so `dist/` works from any static host or sub-path,
e.g. GitHub Pages.

## Deployment

Every push to `main` is linted, type checked, tested, built and published to GitHub Pages by
`.github/workflows/deploy.yml`. One-time setup in the repository: **Settings → Pages → Source: GitHub
Actions**.

## Original task sheets

The original task sheets of the course are in `course-tasks/` (`FL1_HW01.pdf` …
`FL1_HW15.pdf`), and every homework page links its own sheet.

## Project structure

```text
public/legacy/            the homework: original HTML/CSS pages 01–06 (as they were, plus the
                          easter eggs) and the cleaned-up vanilla JS solutions 07–15
src/homeworkList.ts       title, task summary and page of every homework
src/taskSheets.ts         links of the original task sheets
src/taskSamples.ts        the sample pictures of every task, with captions
src/components/           shared UI: layout and footer, theme switch, the frame that embeds a
                          homework page, the samples popup, the contact form
src/pages/                home, homework and not found pages
src/assets/thumbnails/    card pictures of the home page
src/assets/task-samples/  sample pictures of the tasks, from the course's task folders and sheets
src/site.ts               portfolio and repository links
tests/                    Vitest tests of the vanilla JS homework 07–15
scripts/thumbnails.ts     takes the card pictures
course-tasks/             the original task sheets (PDF), linked from every homework
```

## License

The code is under the [MIT License](LICENSE). The original task sheets in `course-tasks/` and the
sample pictures in `src/assets/task-samples/` belong to EPAM; the solutions are mine.
