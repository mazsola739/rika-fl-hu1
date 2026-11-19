/**
 * Small inline icons. They are decorative (the control or link has its own label),
 * so they are hidden from screen readers and take the text colour and size (1em).
 * GitHub mark: Octicons (MIT). Sun, moon: Lucide (ISC).
 */
type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  )
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...stroke}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...stroke}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function FileTextIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...stroke}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8m8 4H8m8 4H8" />
    </svg>
  )
}
