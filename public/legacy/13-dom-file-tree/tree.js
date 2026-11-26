/**
 * Pure tree operations. A node is `{ id, title, isFolder, children }`; the id is the path of
 * indexes in the original structure (e.g. `'0.1'`), so it stays the same after a rename.
 */

/** Turns the task's structure into tree nodes. A folder with `children: null` is empty. */
export function buildTree(entries, parentId = '') {
  return entries.map((entry, index) => {
    const id = parentId === '' ? String(index) : `${parentId}.${index}`
    const isFolder = entry.folder === true

    return {
      id,
      title: entry.title,
      isFolder,
      children: isFolder ? buildTree(entry.children ?? [], id) : [],
    }
  })
}

/** Finds a node by its id anywhere in the tree, or returns `null`. */
export function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    const found = findNode(node.children, id)
    if (found !== null) {
      return found
    }
  }

  return null
}

/** Returns a new tree without the node (and its subtree). */
export function removeNode(nodes, id) {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({ ...node, children: removeNode(node.children, id) }))
}

/** Returns a new tree in which the node has the new title. */
export function renameNode(nodes, id, title) {
  return nodes.map((node) =>
    node.id === id
      ? { ...node, title }
      : { ...node, children: renameNode(node.children, id, title) },
  )
}

/** Where the selection ends when renaming: a file's name is selected without its extension. */
export function getNameSelectionEnd(node) {
  const dotIndex = node.title.lastIndexOf('.')
  // A leading dot (".gitignore") is part of the name, not an extension.
  const hasExtension = !node.isFolder && dotIndex > 0

  return hasExtension ? dotIndex : node.title.length
}

/** Returns a new set with the value added, or removed when it was already there. */
export function toggleInSet(set, value) {
  const next = new Set(set)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }

  return next
}
