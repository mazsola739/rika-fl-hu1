import { type ComponentType, type LazyExoticComponent, lazy } from 'react'

// Every React homework is its own chunk, loaded only when its page is opened.
export const reactHomework: Record<string, LazyExoticComponent<ComponentType>> = {
  '07-intro-to-js': lazy(() => import('./hw07-intro-to-js/IntroToJs')),
  '08-quiz-game': lazy(() => import('./hw08-quiz-game/QuizGame')),
  '09-data-types': lazy(() => import('./hw09-data-types/DataTypes')),
  '10-functions': lazy(() => import('./hw10-functions/Functions')),
  '11-errors-storage': lazy(() => import('./hw11-errors-storage/ErrorsStorage')),
  '12-dates-regex': lazy(() => import('./hw12-dates-regex/DatesRegex')),
  '13-dom-file-tree': lazy(() => import('./hw13-dom-file-tree/FileTree')),
  '14-dom-events': lazy(() => import('./hw14-dom-events/DomEvents')),
  '15-bom-books': lazy(() => import('./hw15-bom-books/Books')),
}
