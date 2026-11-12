import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FileTree from './FileTree'

function rightClick(element: Element) {
  fireEvent.contextMenu(element, { clientX: 20, clientY: 20 })
}

describe('FileTree', () => {
  it('opens folders by clicking their row and keeps the state of subfolders', async () => {
    const user = userEvent.setup()
    render(<FileTree />)

    expect(screen.queryByText('logo.png')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Grow' }))
    await user.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByText('Present_Perfect.txt')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Grow' }))
    expect(screen.queryByText('Present_Perfect.txt')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Grow' }))
    expect(screen.getByText('Present_Perfect.txt')).toBeInTheDocument()
  })

  it('shows "Folder is empty" for empty folders and after deleting the last item', async () => {
    const user = userEvent.setup()
    render(<FileTree />)

    await user.click(screen.getByRole('button', { name: 'Soft' }))
    await user.click(screen.getByRole('button', { name: 'NVIDIA' }))
    expect(screen.getByText('Folder is empty')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Doc' }))
    rightClick(screen.getByText('project_info.txt'))
    await user.click(screen.getByRole('menuitem', { name: 'Delete item' }))
    expect(screen.queryByText('project_info.txt')).not.toBeInTheDocument()
    expect(screen.getAllByText('Folder is empty')).toHaveLength(2)
  })

  it('deletes a folder together with its content', async () => {
    const user = userEvent.setup()
    render(<FileTree />)

    await user.click(screen.getByRole('button', { name: 'Grow' }))
    rightClick(screen.getByRole('button', { name: 'Grow' }))
    await user.click(screen.getByRole('menuitem', { name: 'Delete item' }))
    expect(screen.queryByText('Grow')).not.toBeInTheDocument()
    expect(screen.queryByText('logo.png')).not.toBeInTheDocument()
  })

  it('renames a file with the name selected without its extension', async () => {
    const user = userEvent.setup()
    render(<FileTree />)

    rightClick(screen.getByText('credentials.txt'))
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))

    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Rename credentials.txt' })
    expect(input.value.slice(input.selectionStart ?? 0, input.selectionEnd ?? 0)).toBe(
      'credentials',
    )

    await user.clear(input)
    await user.type(input, 'secrets.txt{Enter}')
    expect(screen.getByText('secrets.txt')).toBeInTheDocument()
  })

  it('disables the menu outside of an item and closes it on an outside click', async () => {
    const user = userEvent.setup()
    render(<FileTree />)

    rightClick(screen.getByRole('region', { name: 'File tree' }))
    for (const item of screen.getAllByRole('menuitem')) {
      expect(item).toBeDisabled()
    }

    await user.click(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('highlights the item while its context menu is open', () => {
    render(<FileTree />)
    const row = screen.getByText('credentials.txt')
    rightClick(row)
    expect(row).toHaveClass('bg-[#2fb8bd]')
  })
})
