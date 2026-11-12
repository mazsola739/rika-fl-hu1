import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { cx } from '../../components/ui'
import { TreeIcon } from './icons'
import { buildTree, data, nameSelectionEnd, removeNode, renameNode, type TreeNode } from './tree'

interface Menu {
  x: number
  y: number
  /** `null` when the menu was opened outside of an item: its options are disabled then. */
  node: TreeNode | null
}

interface TreeContextValue {
  openIds: ReadonlySet<string>
  focusedId: string | null
  renamingId: string | null
  toggle: (id: string) => void
  finishRename: (node: TreeNode, title: string | null) => void
}

const TreeContext = createContext<TreeContextValue | null>(null)

function useTree() {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('useTree must be used inside <FileTree>')
  }
  return context
}

export default function FileTree() {
  const [nodes, setNodes] = useState(() => buildTree(data))
  // Open folders are kept by id, so a subfolder keeps its state while its parent is closed.
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())
  const [menu, setMenu] = useState<Menu | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) {
      return
    }
    const closeOnOutsideClick = (event: globalThis.MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenu(null)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(null)
      }
    }
    document.addEventListener('click', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('click', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menu])

  function findNode(list: readonly TreeNode[], id: string): TreeNode | null {
    for (const node of list) {
      if (node.id === id) {
        return node
      }
      const found = findNode(node.children, id)
      if (found) {
        return found
      }
    }
    return null
  }

  function openMenu(event: MouseEvent) {
    event.preventDefault()
    const row = (event.target as HTMLElement).closest<HTMLElement>('[data-node-id]')
    const id = row?.dataset.nodeId
    setMenu({ x: event.clientX, y: event.clientY, node: id ? findNode(nodes, id) : null })
  }

  const context: TreeContextValue = {
    openIds,
    focusedId: menu?.node?.id ?? null,
    renamingId,
    toggle: (id) =>
      setOpenIds((current) => {
        const next = new Set(current)
        if (!next.delete(id)) {
          next.add(id)
        }
        return next
      }),
    finishRename: (node, title) => {
      const trimmed = title?.trim()
      if (trimmed) {
        setNodes((current) => renameNode(current, node.id, trimmed))
      }
      setRenamingId(null)
    },
  }

  return (
    <TreeContext value={context}>
      <div className="rounded-3xl bg-[#b3eaec] p-4 sm:p-10">
        <section
          aria-label="File tree"
          onContextMenu={openMenu}
          className="mx-auto max-w-md rounded-lg bg-white px-6 py-5 text-slate-900 shadow-[0_0_15px_rgba(0,0,0,0.5)] select-none"
        >
          <TreeList nodes={nodes} />
        </section>
      </div>

      {menu && (
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-10 flex w-40 flex-col rounded-r-md rounded-bl-md bg-[#e6fcfc] p-1 text-slate-900 shadow-[0_0_5px_rgba(0,0,0,0.6)]"
          style={{ left: menu.x, top: menu.y }}
        >
          <MenuItem
            disabled={!menu.node}
            onClick={() => {
              setRenamingId(menu.node?.id ?? null)
              setMenu(null)
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            disabled={!menu.node}
            onClick={() => {
              const id = menu.node?.id
              if (id) {
                setNodes((current) => removeNode(current, id))
              }
              setMenu(null)
            }}
          >
            Delete item
          </MenuItem>
        </div>
      )}
    </TreeContext>
  )
}

function MenuItem({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="cursor-pointer rounded px-2 py-1 text-left hover:bg-[#8ee5e8] disabled:cursor-default disabled:text-slate-400 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}

function TreeList({ nodes, nested = false }: { nodes: readonly TreeNode[]; nested?: boolean }) {
  return (
    <ul className={cx(nested && 'pl-6')}>
      {nodes.length === 0 ? (
        <li className="py-0.5 pl-8 text-slate-500 italic">Folder is empty</li>
      ) : (
        nodes.map((node) => <TreeItem key={node.id} node={node} />)
      )}
    </ul>
  )
}

function TreeItem({ node }: { node: TreeNode }) {
  const { openIds, focusedId, renamingId, toggle, finishRename } = useTree()
  const isOpen = node.isFolder && openIds.has(node.id)
  const icon = (
    <TreeIcon
      name={node.isFolder ? (isOpen ? 'folderOpen' : 'folder') : 'file'}
      className={cx('size-6 shrink-0', node.isFolder ? 'text-[#04a6ac]' : 'text-[#9fd8db]')}
    />
  )
  const rowClass = cx(
    'flex w-full items-center gap-1 rounded-md px-1 py-0.5 text-left',
    focusedId === node.id ? 'bg-[#2fb8bd] text-white' : 'hover:bg-[#8ee5e8]',
  )

  let row: ReactNode
  if (renamingId === node.id) {
    row = (
      <div data-node-id={node.id} className={rowClass}>
        {icon}
        <RenameInput node={node} onDone={(title) => finishRename(node, title)} />
      </div>
    )
  } else if (node.isFolder) {
    row = (
      <button
        type="button"
        data-node-id={node.id}
        aria-expanded={isOpen}
        onClick={() => toggle(node.id)}
        className={cx(rowClass, 'cursor-pointer')}
      >
        {icon}
        {node.title}
      </button>
    )
  } else {
    row = (
      <div data-node-id={node.id} className={rowClass}>
        {icon}
        {node.title}
      </div>
    )
  }

  return (
    <li>
      {row}
      {isOpen && <TreeList nodes={node.children} nested />}
    </li>
  )
}

function RenameInput({ node, onDone }: { node: TreeNode; onDone: (title: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const finished = useRef(false)

  useLayoutEffect(() => {
    const input = ref.current
    if (input) {
      input.focus()
      input.setSelectionRange(0, nameSelectionEnd(node))
    }
  }, [node])

  function finish(title: string | null) {
    if (!finished.current) {
      finished.current = true
      onDone(title)
    }
  }

  return (
    <input
      ref={ref}
      aria-label={`Rename ${node.title}`}
      defaultValue={node.title}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          finish(event.currentTarget.value)
        } else if (event.key === 'Escape') {
          finish(null)
        }
      }}
      onBlur={(event) => finish(event.currentTarget.value)}
      className="min-w-0 flex-1 rounded border border-slate-400 px-1 text-slate-900"
    />
  )
}
