import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="py-16 text-center">
      <title>Not found – FL-HU1</title>
      <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        There is no homework at this address.
      </p>
      <Link to="/" className="font-semibold text-accent hover:underline">
        ← Back to all homework
      </Link>
    </section>
  )
}
