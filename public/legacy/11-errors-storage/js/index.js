import { viewResults, visitLink } from './visits.js'

function showResults(lines) {
  const list = document.createElement('ul')
  list.className = 'visit-results'
  list.setAttribute('aria-label', 'Page visits')
  for (const line of lines) {
    const item = document.createElement('li')
    item.textContent = line
    list.append(item)
  }
  document.querySelector('.visit-results')?.remove()
  document.querySelector('.content').append(list)
}

function countVisits(event) {
  const link = event.target.closest('a[data-page]')
  if (link) {
    visitLink(link.dataset.page)
  }
}

function setUpVisitCounter() {
  // One listener for the whole menu instead of one per link.
  document.querySelector('.nav').addEventListener('click', countVisits)
  document
    .querySelector('.view-results')
    ?.addEventListener('click', () => showResults(viewResults()))
}

setUpVisitCounter()
