import { type FormEvent, type ReactNode, useState } from 'react'
import { NavLink, Route, Routes, useParams } from 'react-router'
import { Button, cx, Output, Panel, TextField } from '../../components/ui'
import { ExpressionError, evaluate } from './calculator'
import { PAGES, type PageName, viewResults, visitLink } from './visits'

const BASE = '/hw/11-errors-storage'

export default function ErrorsStorage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <VisitCounter />
      <Calculator />
    </div>
  )
}

function VisitCounter() {
  return (
    <Panel title="Task 1 – Page visit counter">
      <nav className="mb-4 flex flex-wrap gap-1">
        <PageLink to={BASE} end>
          Home
        </PageLink>
        {PAGES.map((page, index) => (
          <PageLink key={page} to={`${BASE}/page/${index + 1}`} onClick={() => visitLink(page)}>
            Page {index + 1}
          </PageLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<VisitHome />} />
        <Route path="page/:number" element={<VisitPage />} />
      </Routes>
    </Panel>
  )
}

function PageLink({
  to,
  end,
  onClick,
  children,
}: {
  to: string
  end?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cx(
          'rounded-full px-4 py-1.5 text-sm font-semibold',
          isActive
            ? 'bg-accent text-white'
            : 'text-accent hover:bg-accent-soft dark:hover:bg-slate-800',
        )
      }
    >
      {children}
    </NavLink>
  )
}

function VisitHome() {
  const [results, setResults] = useState<string[] | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-slate-600 dark:text-slate-300">
        Click the page links above, then come back and check the counts.
      </p>
      <Button className="self-start" onClick={() => setResults(viewResults())}>
        View page visits results
      </Button>
      {results && (
        <ul className="list-disc pl-5 text-sm">
          {results.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function VisitPage() {
  const { number } = useParams()
  const page = PAGES[Number(number) - 1] as PageName | undefined

  return page ? (
    <p className="text-slate-600 dark:text-slate-300">
      Welcome to {page.replace('Page', 'Page ')}. This visit has been counted in localStorage.
    </p>
  ) : (
    <p className="text-slate-600 dark:text-slate-300">There is no such page.</p>
  )
}

function Calculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<{ text: string; error: boolean } | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      setResult({ text: `${expression.trim()} = ${evaluate(expression)}`, error: false })
    } catch (error) {
      if (!(error instanceof ExpressionError)) {
        throw error
      }
      setResult({ text: `Invalid expression: ${error.message}. Please try again.`, error: true })
    }
  }

  return (
    <Panel title="Task 2 – Calculator">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextField
          label="Mathematical expression"
          placeholder="2 + 3 * (4 - 1)"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
        />
        <Button type="submit" className="self-start">
          Calculate
        </Button>
        {result && <Output tone={result.error ? 'error' : 'neutral'}>{result.text}</Output>}
      </form>
    </Panel>
  )
}
