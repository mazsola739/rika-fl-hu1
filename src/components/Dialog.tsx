import { type ReactNode, useEffect, useRef } from 'react'
import { Button } from './ui'

/** A modal built on the native <dialog> element (focus trap and Escape handling for free). */
export function Dialog({
  open,
  children,
  confirmLabel = 'OK',
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  children: ReactNode
  confirmLabel?: string
  /** Without a cancel label the dialog works like alert(). */
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault()
        ;(onCancel ?? onConfirm)()
      }}
      className="m-auto w-[min(24rem,calc(100%-2rem))] rounded-2xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="mb-6 text-base">{children}</div>
      <div className="flex justify-end gap-2">
        {cancelLabel && (
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button onClick={onConfirm} autoFocus>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
