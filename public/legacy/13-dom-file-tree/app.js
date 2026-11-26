import { structure } from './structure.js'
import {
  buildTree,
  findNode,
  getNameSelectionEnd,
  removeNode,
  renameNode,
  toggleInSet,
} from './tree.js'

const ICON = {
  folder: 'folder',
  folderOpen: 'folder_open',
  file: 'insert_drive_file',
}
const MENU_EDGE_GAP = 4

const root = document.querySelector('#root')
root.classList.add('file-tree')
const menu = createMenu()

// Rika's tree: everything the page shows is rendered from this state.
const state = {
  nodes: buildTree(structure),
  // Open folders are kept by id, so a subfolder keeps its state while its parent is closed.
  openIds: new Set(),
  // The item the context menu was opened on; `null` outside of an item.
  focusedId: null,
  renamingId: null,
  isMenuOpen: false,
}

function createIcon(name, className) {
  const icon = document.createElement('i')
  icon.className = `material-icons ${className}`
  icon.setAttribute('aria-hidden', 'true')
  icon.textContent = name

  return icon
}

function getIconName(node) {
  if (!node.isFolder) {
    return ICON.file
  }

  return state.openIds.has(node.id) ? ICON.folderOpen : ICON.folder
}

function createRenameInput(node) {
  const input = document.createElement('input')
  input.className = 'tree-rename'
  input.value = node.title
  input.setAttribute('aria-label', `Rename ${node.title}`)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      finishRename(input.value)
    } else if (event.key === 'Escape') {
      finishRename(null)
    }
  })
  input.addEventListener('blur', () => finishRename(input.value))

  return input
}

function createRow(node) {
  const isRenaming = state.renamingId === node.id
  // A folder row is a real button (keyboard support); a file row does nothing on click.
  const isButton = node.isFolder && !isRenaming
  const row = document.createElement(isButton ? 'button' : 'div')
  row.className = 'tree-row'
  row.dataset.id = node.id
  row.classList.toggle('is-focused', state.isMenuOpen && state.focusedId === node.id)
  if (isButton) {
    row.type = 'button'
    row.setAttribute('aria-expanded', String(state.openIds.has(node.id)))
  }

  const iconClass = node.isFolder ? 'tree-icon tree-icon--folder' : 'tree-icon tree-icon--file'
  row.append(createIcon(getIconName(node), iconClass))
  row.append(isRenaming ? createRenameInput(node) : node.title)

  return row
}

function createEmptyItem() {
  const item = document.createElement('li')
  item.className = 'tree-empty'
  item.textContent = 'Folder is empty'

  return item
}

function createList(nodes, isNested = false) {
  const list = document.createElement('ul')
  list.className = isNested ? 'tree tree--nested' : 'tree'

  if (nodes.length === 0) {
    list.append(createEmptyItem())

    return list
  }
  for (const node of nodes) {
    const item = document.createElement('li')
    item.append(createRow(node))
    if (node.isFolder && state.openIds.has(node.id)) {
      item.append(createList(node.children, true))
    }
    list.append(item)
  }

  return list
}

function getRow(id) {
  return root.querySelector(`[data-id="${id}"]`)
}

function renderTree() {
  // The tree is rebuilt on every change, so the focused row gets its focus back afterwards.
  const focusedRowId = document.activeElement?.closest('.tree-row')?.dataset.id
  root.replaceChildren(createList(state.nodes))

  if (state.renamingId !== null) {
    const input = root.querySelector('.tree-rename')
    input.focus()
    input.setSelectionRange(0, getNameSelectionEnd(findNode(state.nodes, state.renamingId)))
  } else if (focusedRowId !== undefined) {
    getRow(focusedRowId)?.focus()
  }
}

function toggleFolder(id) {
  state.openIds = toggleInSet(state.openIds, id)
  renderTree()
}

function startRename(id) {
  hideMenu()
  state.renamingId = id
  renderTree()
}

function finishRename(value) {
  // Removing the input fires blur after Enter too: the rename must only finish once.
  if (state.renamingId === null) {
    return
  }
  const id = state.renamingId
  const title = value === null ? '' : value.trim()
  state.renamingId = null
  if (title !== '') {
    state.nodes = renameNode(state.nodes, id, title)
  }
  renderTree()
  getRow(id)?.focus()
}

function deleteItem(id) {
  state.nodes = removeNode(state.nodes, id)
  closeMenu()
}

function createMenuItem(label, action) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'context-menu__item'
  button.dataset.action = action
  button.setAttribute('role', 'menuitem')
  button.textContent = label

  return button
}

function createMenu() {
  const element = document.createElement('div')
  element.className = 'context-menu'
  element.setAttribute('role', 'menu')
  element.hidden = true
  element.append(createMenuItem('Rename', 'rename'), createMenuItem('Delete item', 'delete'))
  document.body.append(element)

  return element
}

function openMenu(x, y, id) {
  state.focusedId = id
  state.isMenuOpen = true
  for (const button of menu.querySelectorAll('button')) {
    button.disabled = id === null
  }
  menu.hidden = false
  // Keep the whole menu inside the window, also near the right and bottom edges.
  const maxLeft = window.innerWidth - menu.offsetWidth - MENU_EDGE_GAP
  const maxTop = window.innerHeight - menu.offsetHeight - MENU_EDGE_GAP
  menu.style.left = `${Math.max(0, Math.min(x, maxLeft))}px`
  menu.style.top = `${Math.max(0, Math.min(y, maxTop))}px`
  renderTree()
}

function hideMenu() {
  state.isMenuOpen = false
  state.focusedId = null
  menu.hidden = true
}

function closeMenu() {
  if (state.isMenuOpen) {
    hideMenu()
    renderTree()
  }
}

root.addEventListener('click', (event) => {
  const row = event.target.closest('.tree-row')
  if (row === null || event.target.closest('.tree-rename') !== null) {
    return
  }
  const node = findNode(state.nodes, row.dataset.id)
  if (node?.isFolder) {
    toggleFolder(node.id)
  }
})

document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  const row = event.target.closest('#root .tree-row')
  openMenu(event.clientX, event.clientY, row === null ? null : row.dataset.id)
})

menu.addEventListener('click', (event) => {
  const button = event.target.closest('button')
  const id = state.focusedId
  if (button === null || button.disabled || id === null) {
    return
  }
  if (button.dataset.action === 'rename') {
    startRename(id)
  } else {
    deleteItem(id)
  }
})

document.addEventListener('click', (event) => {
  if (!menu.contains(event.target)) {
    closeMenu()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
})

window.addEventListener('resize', closeMenu)

renderTree()
