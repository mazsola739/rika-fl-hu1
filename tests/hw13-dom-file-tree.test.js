import { describe, expect, it } from 'vitest'
import { structure } from '../public/legacy/13-dom-file-tree/structure.js'
import {
  buildTree,
  findNode,
  getNameSelectionEnd,
  removeNode,
  renameNode,
  toggleInSet,
} from '../public/legacy/13-dom-file-tree/tree.js'

describe('HW13 file tree logic', () => {
  const tree = buildTree(structure)

  it('builds nodes with path ids from the task structure', () => {
    expect(tree.map((node) => node.title)).toEqual(['Grow', 'Soft', 'Doc', 'credentials.txt'])
    expect(tree[0]).toMatchObject({ id: '0', isFolder: true })
    expect(tree[0].children[1]).toMatchObject({ id: '0.1', title: 'English', isFolder: true })
    expect(tree[3]).toMatchObject({ id: '3', isFolder: false, children: [] })
  })

  it('turns a folder with children: null into an empty folder', () => {
    const nvidia = findNode(tree, '1.0')
    expect(nvidia).toMatchObject({ title: 'NVIDIA', isFolder: true, children: [] })
  })

  it('hides the Rika easter egg in the Grow folder', () => {
    expect(tree[0].children.map((node) => node.title)).toContain('rika_was_here.txt')
  })

  it('finds nested nodes and returns null for unknown ids', () => {
    expect(findNode(tree, '0.1.0')?.title).toBe('Present_Perfect.txt')
    expect(findNode(tree, '9.9')).toBeNull()
  })

  it('removes a node with its subtree without changing the original', () => {
    const next = removeNode(tree, '0.1')
    expect(findNode(next, '0.1')).toBeNull()
    expect(findNode(next, '0.1.0')).toBeNull()
    expect(findNode(tree, '0.1')).not.toBeNull()
  })

  it('leaves an empty folder after its last item is deleted', () => {
    expect(findNode(removeNode(tree, '2.0'), '2')?.children).toEqual([])
  })

  it('renames a nested node and keeps its id', () => {
    const next = renameNode(tree, '0.1.0', 'Past_Simple.txt')
    expect(findNode(next, '0.1.0')?.title).toBe('Past_Simple.txt')
    expect(findNode(tree, '0.1.0')?.title).toBe('Present_Perfect.txt')
  })

  it('selects a file name without its extension', () => {
    expect(getNameSelectionEnd({ title: 'Present_Perfect.txt', isFolder: false })).toBe(15)
    expect(getNameSelectionEnd({ title: 'archive.tar.gz', isFolder: false })).toBe(11)
    expect(getNameSelectionEnd({ title: '.gitignore', isFolder: false })).toBe(10)
    expect(getNameSelectionEnd({ title: 'README', isFolder: false })).toBe(6)
    expect(getNameSelectionEnd({ title: 'v1.2', isFolder: true })).toBe(4)
  })

  it('toggles a value in a new set', () => {
    const open = toggleInSet(new Set(), '0')
    expect([...open]).toEqual(['0'])
    expect([...toggleInSet(open, '0')]).toEqual([])
    expect([...open]).toEqual(['0'])
  })
})
