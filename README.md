# FL-HU1 – Front-end Lab homework

My first bigger learning project: the 15 homework tasks of the EPAM Front-end Lab (FL-HU1, 2020–2021),
collected into one React app.

- **HTML & CSS (01–06)** run as the original static pages, embedded with a screen width switcher –
  writing plain HTML, CSS, Sass and Bootstrap was the point of those tasks.
- **JavaScript (07–15)** are rebuilt with React 19 and TypeScript, with Vitest tests for the logic.

## Stack

[Bun](https://bun.sh) · [Vite](https://vite.dev) · React 19 · TypeScript · Tailwind CSS 4 ·
React Router · [Biome](https://biomejs.dev) · Vitest + Testing Library

## Homework

| #  | Topic | Version | What it is |
|----|-------|---------|------------|
| 01 | HTML Basics | original | A page built from HTML tags and attributes only, with in-page navigation. |
| 02 | CSS Basics | original | Styling a given page without touching its HTML: specificity, hover and focus. |
| 03 | Preprocessors | original | One SCSS source compiled into a day and a night theme. |
| 04 | CSS Layouts | original | Semantic landing page with a full-height header, built from a design. |
| 05 | Responsive | original | Travel blog with desktop, tablet and mobile layouts. |
| 06 | CSS Frameworks | original | Responsive Bootstrap 4 page with a working burger menu. |
| 07 | Intro to JS | React | Defective battery calculator and the middle character of a word. |
| 08 | Debugging | React | "Who Wants to Be a Millionaire?" style quiz game. |
| 09 | Data types | React | Array and string helpers without built-in methods. |
| 10 | Functions | React | Small functions without the `Math` object. |
| 11 | Errors, storage | React | Page visit counter in `localStorage` and a calculator with its own parser. |
| 12 | Date, RegExp | React | Date helpers and regular expression validators. |
| 13 | DOM | React | File tree with a custom context menu, rename and delete. |
| 14 | DOM events | React | Color-toggling table, phone validation and a basketball court with a `CustomEvent`. |
| 15 | BOM | React | Editable book list with routing, back/forward support and `localStorage`. |

## Getting started

```bash
bun install
bun run dev
```

| Command | What it does |
|---------|--------------|
| `bun run dev` | Starts the Vite dev server. |
| `bun run build` | Type checks and builds the static site into `dist/`. |
| `bun run preview` | Serves the production build locally. |
| `bun run test` | Runs the Vitest suite (`test:watch` for watch mode). |
| `bun run lint` | Biome lint and format check (`format` applies the fixes). |
| `bun run build:hw03` | Recompiles the SCSS of homework 03 into its two CSS themes. |

The build uses a relative base and hash routing, so `dist/` works from any static host or sub-path,
e.g. GitHub Pages.

## Project structure

```text
public/legacy/      original HTML/CSS homework 01–06 (served as they are)
public/hw15/        default book cover of homework 15
src/homeworkList.ts title, task summary and type of every homework
src/homework/       React versions of homework 07–15, each with its tests
src/components/     shared UI: layout, legacy page frame, example table, dialog
src/pages/          home, homework and not found pages
```
