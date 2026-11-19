import { type FormEvent, type ReactNode, useEffect, useRef } from 'react'

type BrowserDialogProps = {
  /** The JavaScript call the dialog stands for, e.g. `prompt('Enter a word')`. */
  call: string
  message: string
  /** `prompt()` has a text field and a Cancel button; `alert()` only an OK button. */
  kind: 'prompt' | 'alert'
  /** The second argument of `prompt()`: the field starts with it. */
  defaultValue?: string
  /** Move the focus into the dialog when it appears (not on page load, only after a step). */
  autoFocus?: boolean
  /** OK: the text of the field for a prompt (an empty string for an alert). */
  onOk: (value: string) => void
  /** Cancel: `prompt()` returns null. */
  onCancel?: () => void
}

/**
 * Looks like the browser's own prompt() and alert() windows, which the original homework used:
 * "<site> says", the message, a field for prompt(), and OK / Cancel. It is drawn inside the page
 * instead of blocking it, so both tasks can run side by side.
 */
export function BrowserDialog({
  call,
  message,
  kind,
  defaultValue = '',
  autoFocus = false,
  onOk,
  onCancel,
}: BrowserDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const okRef = useRef<HTMLButtonElement>(null)
  const site = `${window.location.host || 'This page'} says`

  useEffect(() => {
    if (!autoFocus) return
    if (inputRef.current) {
      // Like the browser: the field gets the focus with its default value selected.
      inputRef.current.focus()
      inputRef.current.select()
    } else {
      okRef.current?.focus()
    }
  }, [autoFocus])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onOk(inputRef.current?.value ?? '')
  }

  return (
    <BrowserPage>
      <p className="mb-2 text-center font-mono text-xs text-slate-500 dark:text-slate-400">
        {call}
      </p>
      <form
        aria-label={site}
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-sm rounded-lg bg-white p-5 font-[system-ui] text-sm text-[#202124] shadow-[0_4px_20px_rgb(0_0_0/0.25)] ring-1 ring-black/5 dark:bg-[#292a2d] dark:text-[#e8eaed] dark:ring-white/10"
      >
        <p className="text-[0.95rem] font-medium">{site}</p>
        <p className="mt-3 whitespace-pre-line">{message}</p>
        {kind === 'prompt' && (
          <input
            ref={inputRef}
            aria-label={message}
            defaultValue={defaultValue}
            className="mt-3 w-full rounded border border-[#1a73e8] bg-white px-2 py-1.5 ring-1 ring-[#1a73e8] outline-none dark:border-[#8ab4f8] dark:bg-[#202124] dark:ring-[#8ab4f8]"
          />
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={okRef}
            type="submit"
            className="cursor-pointer rounded-full bg-[#1a73e8] px-5 py-1.5 font-medium text-white hover:bg-[#1765cc] dark:bg-[#8ab4f8] dark:text-[#202124] dark:hover:bg-[#aecbfa]"
          >
            OK
          </button>
          {kind === 'prompt' && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-full border border-[#dadce0] px-5 py-1.5 font-medium text-[#1a73e8] hover:bg-[#f6fafe] dark:border-[#5f6368] dark:text-[#8ab4f8] dark:hover:bg-[#8ab4f8]/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </BrowserPage>
  )
}

/** The page behind the dialog, dimmed like the browser does while a prompt is open. */
function BrowserPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-64 rounded-lg bg-slate-200/70 px-3 pt-3 pb-8 dark:bg-black/40">
      {children}
    </div>
  )
}
