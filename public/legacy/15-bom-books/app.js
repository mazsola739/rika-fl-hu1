import { DEFAULT_COVER } from './books.js'
import {
  addBook,
  getRouteUrl,
  isComplete,
  loadBooks,
  normalizeFields,
  parseRoute,
  saveBooks,
  updateBook,
  VIEW,
} from './store.js'

const ALERT_DELAY_MS = 200
const FORM_FIELDS = [
  { name: 'title', label: 'Book name' },
  { name: 'author', label: 'Author' },
  { name: 'image', label: 'Image URL' },
  { name: 'plot', label: 'Plot', isMultiline: true },
]
const PLOT_ROWS = 4

function getStorage() {
  // Reading localStorage itself throws when the browser blocks site data.
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const storage = getStorage()
let books = loadBooks(storage)

const root = document.querySelector('#root')
const listSection = document.createElement('section')
const detailsSection = document.createElement('section')

/* Small DOM helpers */

function createElement(tag, className, text) {
  const element = document.createElement(tag)
  if (className) {
    element.className = className
  }
  if (text !== undefined) {
    element.textContent = text
  }

  return element
}

function createButton(text, className, type = 'button') {
  const button = createElement('button', className, text)
  button.type = type

  return button
}

function createCover(book, className, alt) {
  const image = createElement('img', className)
  image.alt = alt
  image.src = book.image || DEFAULT_COVER
  // A broken image URL gets the default cover (only once, so it cannot loop).
  image.addEventListener('error', () => {
    if (!image.src.endsWith(DEFAULT_COVER)) {
      image.src = DEFAULT_COVER
    }
  })

  return image
}

/* Routing */

function getCurrentUrl() {
  return `${location.pathname}${location.search}${location.hash}`
}

function getUrl(route) {
  return `${location.pathname}${getRouteUrl(route)}`
}

function getCurrentRoute() {
  return parseRoute(location.search, location.hash, books)
}

/** Opens a route as a new history entry; it remembers where it came from. */
function navigate(route) {
  // Clicking the book that is already open does not add the same page to the history again.
  if (getUrl(route) === getCurrentUrl()) {
    return
  }
  history.pushState({ from: getCurrentUrl() }, '', getUrl(route))
  render()
}

/** Shows a route in place of the current history entry. */
function replaceRoute(route) {
  history.replaceState(history.state, '', getUrl(route))
  render()
}

/**
 * Goes to the route: back in the history when that is where the user came from (so the history
 * does not fill up with copies), otherwise in place of the current entry (e.g. the form was
 * opened from a typed-in URL).
 */
function leaveTo(route) {
  if (history.state?.from === getUrl(route)) {
    history.back()
  } else {
    replaceRoute(route)
  }
}

/* The list of books */

function createBookCard(book, isActive) {
  const card = createElement('li', isActive ? 'book-card book-card--active' : 'book-card')
  card.append(createCover(book, 'book-card__cover', ''))
  card.append(createElement('p', 'book-card__author', book.author))

  const title = createElement('h2', 'book-card__title')
  // A real link: the whole card is clickable, and it can also be opened in a new tab.
  const link = createElement('a', 'book-card__link', book.title)
  link.href = getUrl({ view: VIEW.preview, id: book.id })
  link.dataset.id = String(book.id)
  title.append(link)
  card.append(title)

  const editButton = createButton('Edit', 'button book-card__edit')
  editButton.dataset.id = String(book.id)
  editButton.setAttribute('aria-label', `Edit ${book.title}`)
  card.append(editButton)

  return card
}

function createAddCard() {
  const card = createElement('li', 'book-card book-card--add')
  card.append(createButton('Add book', 'button book-list__add'))

  return card
}

function renderList(route) {
  const heading = createElement('h1', 'book-list__heading', "Rika's bookshelf")
  const list = createElement('ul', 'book-list__items')
  for (const book of books) {
    list.append(createBookCard(book, book.id === route.id))
  }
  list.append(createAddCard())
  listSection.replaceChildren(heading, list)
}

/* The dynamic section */

function renderEmptyDetails() {
  detailsSection.replaceChildren(
    createElement('p', 'details__hint', 'Select a book to see the details.'),
  )
}

function renderPreview(book) {
  const article = createElement('article', 'preview')
  article.append(
    createElement('p', 'preview__author', book.author),
    createElement('h2', 'preview__title', book.title),
    createCover(book, 'preview__cover', `Cover of ${book.title}`),
    createElement('p', 'preview__plot', book.plot),
  )
  detailsSection.replaceChildren(article)
}

function createField({ name, label, isMultiline }, value) {
  const wrapper = createElement('div', 'form__field')
  const id = `book-${name}`
  const labelElement = createElement('label', 'form__label', label)
  labelElement.htmlFor = id

  const input = createElement(isMultiline ? 'textarea' : 'input', 'form__input')
  if (isMultiline) {
    input.rows = PLOT_ROWS
  } else {
    input.type = 'text'
  }
  input.id = id
  input.name = name
  input.required = true
  input.value = value
  wrapper.append(labelElement, input)

  return wrapper
}

function getFormFields(form) {
  const values = {}
  for (const { name } of FORM_FIELDS) {
    values[name] = form.elements.namedItem(name).value
  }

  return normalizeFields(values)
}

function showAlertLater(message) {
  // The task asks for the alert 200ms after the save, when the preview is already shown.
  setTimeout(() => window.alert(message), ALERT_DELAY_MS)
}

function saveForm(form, book) {
  const fields = getFormFields(form)
  // Write the trimmed values back, so a blank-only field fails the required check too.
  for (const { name } of FORM_FIELDS) {
    form.elements.namedItem(name).value = fields[name]
  }
  if (!form.reportValidity() || !isComplete(fields)) {
    return
  }

  let savedBook
  if (book === null) {
    const result = addBook(books, fields)
    books = result.books
    savedBook = result.book
  } else {
    books = updateBook(books, book.id, fields)
    savedBook = { id: book.id, ...fields }
  }
  saveBooks(storage, books)
  leaveTo({ view: VIEW.preview, id: savedBook.id })
  showAlertLater(book === null ? 'Book successfully added' : 'Book successfully updated')
}

function cancelForm(book) {
  if (!window.confirm('Discard changes?')) {
    return
  }
  if (history.state?.from) {
    history.back()
  } else {
    replaceRoute(book === null ? { view: VIEW.list } : { view: VIEW.preview, id: book.id })
  }
}

/** The edit form of a book, or the empty add form when `book` is null. */
function renderForm(book) {
  const form = createElement('form', 'form')
  form.noValidate = true
  form.append(createElement('h2', 'form__heading', book === null ? 'Add book' : 'Edit book'))
  for (const field of FORM_FIELDS) {
    form.append(createField(field, book === null ? '' : book[field.name]))
  }

  const actions = createElement('p', 'form__actions')
  const cancelButton = createButton('Cancel', 'button')
  actions.append(createButton('Save', 'button', 'submit'), cancelButton)
  form.append(actions)

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    saveForm(form, book)
  })
  cancelButton.addEventListener('click', () => cancelForm(book))
  detailsSection.replaceChildren(form)
  form.elements.namedItem(FORM_FIELDS[0].name).focus()
}

function renderDetails(route) {
  const book = books.find((item) => item.id === route.id) ?? null
  if (route.view === VIEW.preview) {
    renderPreview(book)
  } else if (route.view === VIEW.edit) {
    renderForm(book)
  } else if (route.view === VIEW.add) {
    renderForm(null)
  } else {
    renderEmptyDetails()
  }
}

function render() {
  let route = getCurrentRoute()
  if (!route.isValid) {
    // A wrong URL shows the home page: just the list, with a clean URL.
    route = { view: VIEW.list, id: null }
    history.replaceState(history.state, '', getUrl(route))
  }
  renderList(route)
  renderDetails(route)
}

/* Events */

listSection.addEventListener('click', (event) => {
  const link = event.target.closest('.book-card__link')
  const editButton = event.target.closest('.book-card__edit')
  const isModifiedClick = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey

  if (link !== null && !isModifiedClick) {
    event.preventDefault()
    navigate({ view: VIEW.preview, id: Number(link.dataset.id) })
  } else if (editButton !== null) {
    navigate({ view: VIEW.edit, id: Number(editButton.dataset.id) })
  } else if (event.target.closest('.book-list__add') !== null) {
    navigate({ view: VIEW.add })
  }
})

window.addEventListener('popstate', render)

root.classList.add('bookshelf')
listSection.className = 'book-list'
listSection.setAttribute('aria-label', 'Books')
detailsSection.className = 'details'
detailsSection.setAttribute('aria-label', 'Book details')
root.append(listSection, detailsSection)
render()
