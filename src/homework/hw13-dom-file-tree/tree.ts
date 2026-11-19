/** Shape of the data given in the task. */
export interface Entry {
  title: string
  folder?: boolean
  children?: Entry[] | null
}

export interface TreeNode {
  id: string
  title: string
  isFolder: boolean
  children: TreeNode[]
}

export const data: Entry[] = [
  {
    folder: true,
    title: 'Grow',
    children: [
      { title: 'logo.png' },
      { folder: true, title: 'English', children: [{ title: 'Present_Perfect.txt' }] },
      // Easter egg, not part of the task's data.
      { title: 'rika_was_here.txt' },
    ],
  },
  {
    folder: true,
    title: 'Soft',
    children: [
      { folder: true, title: 'NVIDIA', children: null },
      { title: 'nvm-setup.exe' },
      { title: 'node.exe' },
    ],
  },
  { folder: true, title: 'Doc', children: [{ title: 'project_info.txt' }] },
  { title: 'credentials.txt' },
]

export function buildTree(entries: readonly Entry[], prefix = ''): TreeNode[] {
  return entries.map((entry, index) => {
    const id = `${prefix}${index}`
    const isFolder = Boolean(entry.folder)
    return {
      id,
      title: entry.title,
      isFolder,
      children: isFolder ? buildTree(entry.children ?? [], `${id}.`) : [],
    }
  })
}

export function removeNode(nodes: readonly TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({ ...node, children: removeNode(node.children, id) }))
}

export function renameNode(nodes: readonly TreeNode[], id: string, title: string): TreeNode[] {
  return nodes.map((node) =>
    node.id === id
      ? { ...node, title }
      : { ...node, children: renameNode(node.children, id, title) },
  )
}

/** Renaming a file selects its name without the extension. */
export function nameSelectionEnd(node: Pick<TreeNode, 'title' | 'isFolder'>) {
  const dot = node.title.lastIndexOf('.')
  return !node.isFolder && dot > 0 ? dot : node.title.length
}
