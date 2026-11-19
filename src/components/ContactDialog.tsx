import { type FormEvent, useEffect, useRef, useState } from 'react'

// Web3Forms (https://web3forms.com) sends the message to me by e-mail. The key is public: it can
// only send messages to my own inbox. The same form is on my other project pages.
const CONTACT_KEY = '8674bf2a-c248-426a-aed4-379fa983cb34'
const CONTACT_URL = 'https://api.web3forms.com/submit'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const STATUS_TEXT: Record<Status, string> = {
  idle: '',
  sending: '',
  sent: "Thank you! Your message is on its way, I'll write back soon.",
  failed: "Sorry, the message couldn't be sent. Please try again a bit later.",
}

const field =
  'mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'

/** The "Contact me" link of the footer and its window with a short message form. */
export function ContactDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal?.()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const message = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const response = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...message,
          access_key: CONTACT_KEY,
          subject: `FL-HU1 homework: a message from ${String(message.name)}`,
          from_name: 'FL-HU1 homework contact form',
        }),
      })
      const result = await response.json()
      if (!result.success) throw new Error('Not sent')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStatus('idle')
          setIsOpen(true)
        }}
        className="cursor-pointer font-semibold text-link hover:underline"
      >
        Contact me
      </button>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: only the backdrop click; Esc closes the dialog natively */}
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-title"
        onClose={() => setIsOpen(false)}
        // A click on the backdrop lands on the dialog itself, not on its content.
        onClick={(event) => event.target === event.currentTarget && setIsOpen(false)}
        className="m-auto w-[min(440px,92vw)] rounded-lg bg-white p-6 text-left text-slate-800 shadow-2xl backdrop:bg-black/60 dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="contact-title" className="text-xl font-bold">
              Get in touch
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Write me a message and I'll write back.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
            className="grid size-8 cursor-pointer place-items-center rounded-md text-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm font-semibold">
          <label>
            Name
            <input name="name" required maxLength={100} autoComplete="name" className={field} />
          </label>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              className={field}
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              required
              maxLength={5000}
              className={`${field} min-h-28 resize-y`}
            />
          </label>
          {/* People don't see it, spam bots tick it. */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p role="status" className="min-h-5">
            {STATUS_TEXT[status]}
          </p>
          <p className="font-normal text-slate-500 dark:text-slate-400">
            Your message reaches my inbox through Web3Forms. I only use your name and e-mail address
            to write back to you.
          </p>
        </form>
      </dialog>
    </>
  )
}
