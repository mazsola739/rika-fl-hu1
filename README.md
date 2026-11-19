# FL-HU1 – Front-end Lab homework

My first bigger learning project: the homework of the EPAM Front-end Lab (FL-HU1, 2020–2021), the course
where EPAM's trainers taught me front-end development. The 15 tasks are EPAM's, the solutions are mine,
collected into one React app and renovated in 2026.

**Live site:** https://mazsola739.github.io/rika-fl-hu1/

- **HTML & CSS (01–06)** run as the original static pages, embedded with a screen width switcher –
  writing plain HTML, CSS, Sass and Bootstrap was the point of those tasks.
- **JavaScript (07–15)** are rebuilt with React 19 and TypeScript, with Vitest tests for the logic.
- Light and dark theme: the system setting by default, the visitor's choice is remembered.
- Styled like the course's task sheets: Calibri (Carlito), a coral DEADLINE line, cyan section
  headings and the deadline of every homework.
- Homework 07 runs in browser-like `prompt()` and `alert()` windows; the example tables of 09, 10
  and 12 open the code of every function.
- Easter egg: my name, Rika, is hidden in every homework.

Part of my portfolio: https://mazsola739.github.io/mazsola739/

## Stack

[Bun](https://bun.sh) · [Vite](https://vite.dev) · React 19 · TypeScript · Tailwind CSS 4 ·
React Router · [Biome](https://biomejs.dev) · Vitest + Testing Library

## Homework

| #   | Topic           | Version  | What it is                                                                          |
| --- | --------------- | -------- | ----------------------------------------------------------------------------------- |
| 01  | HTML Basics     | original | A page built from HTML tags and attributes only, with in-page navigation.           |
| 02  | CSS Basics      | original | Styling a given page without touching its HTML: specificity, hover and focus.       |
| 03  | Preprocessors   | original | One SCSS source compiled into a day and a night theme.                              |
| 04  | CSS Layouts     | original | Semantic landing page with a full-height header, built from a design.               |
| 05  | Responsive      | original | Travel blog with desktop, tablet and mobile layouts.                                |
| 06  | CSS Frameworks  | original | Responsive Bootstrap 4 page with a working burger menu.                             |
| 07  | Intro to JS     | React    | Defective battery calculator and the middle character of a word.                    |
| 08  | Debugging       | React    | "Who Wants to Be a Millionaire?" style quiz game.                                   |
| 09  | Data types      | React    | Array and string helpers without built-in methods.                                  |
| 10  | Functions       | React    | Small functions without the `Math` object.                                          |
| 11  | Errors, storage | React    | Page visit counter in `localStorage` and a calculator with its own parser.          |
| 12  | Date, RegExp    | React    | Date helpers and regular expression validators.                                     |
| 13  | DOM             | React    | File tree with a custom context menu, rename and delete.                            |
| 14  | DOM events      | React    | Color-toggling table, phone validation and a basketball court with a `CustomEvent`. |
| 15  | BOM             | React    | Editable book list with routing, back/forward support and `localStorage`.           |

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
| `bun run test`       | Runs the Vitest suite (`test:watch` for watch mode).        |
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

The task PDFs are EPAM's course material, so they are not in the repository. Kept locally in
`course-tasks/` (`FL1_HW01.pdf` … `FL1_HW15.pdf`), every homework page links its sheet, and a local
build includes them; a build from the repository alone (e.g. CI) has no sheets and no links.

## Project structure

```text
public/legacy/         original HTML/CSS homework 01–06 (as they were, plus the easter eggs)
public/hw15/           default book cover of homework 15
src/homeworkList.ts    title, task summary and type of every homework
src/homework/          React versions of homework 07–15, each with its tests
src/components/        shared UI: layout, theme switch, legacy page frame, example table, dialog
src/pages/             home, homework and not found pages
src/assets/thumbnails/ card pictures of the home page
src/site.ts            portfolio and repository links
scripts/thumbnails.ts  takes the card pictures
course-tasks/          the original EPAM task PDFs: local only, gitignored, never published
```
