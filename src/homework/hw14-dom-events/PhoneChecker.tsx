import { type FormEvent, useState } from 'react'
import { cx } from '../../components/ui'

export const PHONE_PATTERN = /^\+380\d{9}$/

type Notification = { type: 'error' | 'success'; text: string } | null

export function PhoneChecker() {
  const [phone, setPhone] = useState('')
  const [notification, setNotification] = useState<Notification>(null)
  const isValid = PHONE_PATTERN.test(phone.trim())

  function handleChange(value: string) {
    setPhone(value)
    setNotification(
      PHONE_PATTERN.test(value.trim())
        ? null
        : { type: 'error', text: 'Type number does not follow format +380*********' },
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (isValid) {
      setNotification({ type: 'success', text: 'Data was successfully sent' })
    }
  }

  return (
    // A set width: the tabs share one grid cell that shrinks to its content, so w-full would
    // squeeze the field until its placeholder no longer fits.
    <div className="w-[33rem] max-w-full">
      <p
        role="status"
        className={cx(
          'mb-6 min-h-12 border-2 px-3 py-2',
          !notification && 'invisible',
          notification?.type === 'error' && 'border-[#de4388] bg-[#e693b8]',
          notification?.type === 'success' && 'border-[#5f9939] bg-[#b7de9e]',
        )}
      >
        {notification?.text}
      </p>
      <form onSubmit={handleSubmit} noValidate className="flex gap-3 font-verdana">
        <input
          type="tel"
          aria-label="Phone number"
          placeholder="Type phone number in format +380*********"
          autoComplete="tel"
          value={phone}
          onChange={(event) => handleChange(event.target.value)}
          aria-invalid={notification?.type === 'error'}
          className={cx(
            'h-14 min-w-0 flex-1 border-2 bg-white px-2 text-base outline-none',
            notification?.type === 'error' ? 'border-[#de4388]' : 'border-black',
          )}
        />
        <button
          type="submit"
          disabled={!isValid}
          className="h-14 w-20 shrink-0 cursor-pointer border-2 border-black bg-[#e8e6eb] text-base disabled:cursor-not-allowed disabled:text-[#8a8a8a]"
        >
          Send
        </button>
      </form>
    </div>
  )
}
