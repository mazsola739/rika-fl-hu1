/** The folder structure given in the task. */
export const structure = [
  {
    folder: true,
    title: 'Grow',
    children: [
      { title: 'logo.png' },
      {
        folder: true,
        title: 'English',
        children: [{ title: 'Present_Perfect.txt' }],
      },
      // Not part of the task's data: Rika leaves a note in every homework.
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
  {
    folder: true,
    title: 'Doc',
    children: [{ title: 'project_info.txt' }],
  },
  { title: 'credentials.txt' },
]
