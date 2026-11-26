/** The cover of new books, and of books whose image does not load. */
export const DEFAULT_COVER = 'covers/book-cover.svg'

/** The three books of the very first visit; afterwards the list lives in localStorage. */
export const DEFAULT_BOOKS = [
  {
    id: 1,
    title: 'Harry Potter',
    author: 'J. K. Rowling',
    image: 'covers/harry-potter.svg',
    plot: 'Young boy realizes that he is a wizard.',
  },
  {
    id: 2,
    title: 'How to Cook',
    author: 'Robin Cook',
    image: 'covers/how-to-cook.svg',
    plot: 'Writer realizes he is a cook, but he cannot cook.',
  },
  {
    id: 3,
    title: 'Life in EPAM',
    author: 'Rika',
    image: 'covers/life-in-epam.svg',
    plot: 'Rika goes to EPAM =)',
  },
]
