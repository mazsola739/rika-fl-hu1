import { type ReactNode, useState } from 'react'
import { NavLink, Route, Routes, useParams } from 'react-router'
import { BrowserDialog } from '../../components/BrowserDialog'
import { cx, Panel } from '../../components/ui'
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

/**
 * The original page, rebuilt: it was a Bootstrap 4.5 template (nav-pills, an h3 and a large block
 * button in a 700px column) that could not be edited, so the script added the results list under
 * the button. It stays a white page in the dark theme too.
 */
function VisitCounter() {
  return (
    <Panel title="Task 1 – Page visit counter">
      <div className="rounded-lg bg-white font-bootstrap leading-normal text-[#212529]">
        <div className="mx-auto w-full max-w-[700px] px-4 pb-px">
          <ul className="mt-4 mb-12 ml-12 flex flex-wrap">
            <li>
              <PageLink to={BASE} end>
                Home
              </PageLink>
            </li>
            {PAGES.map((page, index) => (
              <li key={page}>
                <PageLink to={`${BASE}/page/${index + 1}`} onClick={() => visitLink(page)}>
                  Page {index + 1}
                </PageLink>
              </li>
            ))}
          </ul>
          <Routes>
            <Route index element={<VisitHome />} />
            <Route path="page/:number" element={<VisitPage />} />
          </Routes>
        </div>
      </div>
    </Panel>
  )
}

/** Bootstrap's .nav-pills .nav-link. */
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
          'block rounded px-4 py-2',
          isActive ? 'bg-[#007bff] text-white' : 'text-[#007bff] hover:text-[#0056b3]',
        )
      }
    >
      {children}
    </NavLink>
  )
}

/** Bootstrap's h3 with mb-5. */
const heading = 'mb-12 font-medium text-[1.75rem] leading-[1.2]'

function VisitHome() {
  const [results, setResults] = useState<string[] | null>(null)

  return (
    <>
      <h3 className={heading}>Welcome to Local Storage Homework</h3>
      <button
        type="button"
        onClick={() => setResults(viewResults())}
        className="mb-12 block w-full cursor-pointer rounded-[0.3rem] border border-[#007bff] bg-[#007bff] px-4 py-2 text-[1.25rem] leading-normal text-white hover:border-[#0062cc] hover:bg-[#0069d9]"
      >
        View page visits results
      </button>
      {results && (
        <ul aria-label="Page visits" className="mb-4 list-disc pl-10">
          {results.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </>
  )
}

function VisitPage() {
  const { number } = useParams()
  const page = PAGES[Number(number) - 1] as PageName | undefined

  return page ? (
    <>
      <h3 className={heading}>Welcome to Page {number}</h3>
      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac justo ullamcorper,
        porttitor tellus non, tristique purus. Donec ac arcu eu dui dignissim mattis. Integer porta
        scelerisque tempor. Morbi id congue urna. Fusce ut maximus erat.
      </p>
    </>
  ) : (
    <p className="mb-4">There is no such page.</p>
  )
}

type CalculatorStep = { step: 'prompt' } | { step: 'alert'; message: string }

/**
 * Runs like the original script: prompt() for the expression, alert() for the result or the
 * error, then it asks again. Cancel makes prompt() return null, which stops the calculator.
 */
function Calculator() {
  const [state, setState] = useState<CalculatorStep>({ step: 'prompt' })
  // The first prompt does not grab the focus on page load, only when the script asks again.
  const [started, setStarted] = useState(false)

  function calculate(expression: string) {
    // Easter egg: some things cannot be calculated.
    if (expression.trim().toLowerCase() === 'rika') {
      return 'Rika = priceless ✨'
    }
    try {
      return `${expression.trim()} = ${evaluate(expression)}`
    } catch (error) {
      if (!(error instanceof ExpressionError)) {
        throw error
      }
      return `Invalid expression: ${error.message}. Please try again.`
    }
  }

  return (
    <Panel title="Task 2 – Calculator">
      {state.step === 'prompt' ? (
        <BrowserDialog
          key="prompt"
          kind="prompt"
          call="prompt('Enter a mathematical expression', '2 + 3 * (4 - 1)')"
          message="Enter a mathematical expression"
          defaultValue="2 + 3 * (4 - 1)"
          autoFocus={started}
          onOk={(expression) => setState({ step: 'alert', message: calculate(expression) })}
          onCancel={() =>
            setState({ step: 'alert', message: 'Calculator closed. Press OK to start it again.' })
          }
        />
      ) : (
        <BrowserDialog
          key="alert"
          kind="alert"
          call="alert(message)"
          message={state.message}
          autoFocus
          onOk={() => {
            setStarted(true)
            setState({ step: 'prompt' })
          }}
        />
      )}
    </Panel>
  )
}
