import { type ReactNode, useReducer } from 'react'
import { cx } from '../../components/ui'
import { questions } from './questions'
import {
  formatPrize,
  initialQuizState,
  type QuizState,
  quizReducer,
  START_PRIZE,
  WINNING_PRIZE,
} from './quiz'

const random = () => Math.random()
const LETTERS = ['A', 'B', 'C', 'D']

const RULES = [
  `Prize starts at ${formatPrize(START_PRIZE)}`,
  'Doubles every round',
  'One skip per game',
  `${formatPrize(WINNING_PRIZE)} wins`,
]

/** The end of a game: the messages of the task, with a little emoji. */
function getEnding(state: QuizState): { emoji: string; message: string } | null {
  switch (state.status) {
    case 'lost':
      return { emoji: '💸', message: `Game over. Your prize is: ${formatPrize(state.totalPrize)}` }
    case 'won':
      return { emoji: '🏆', message: `Congratulations! You won ${formatPrize(state.totalPrize)}!` }
    case 'outOfQuestions':
      return {
        emoji: '📭',
        message: `No more questions left. Your prize is: ${formatPrize(state.totalPrize)}`,
      }
    default:
      return null
  }
}

/**
 * The look of the original: a frame in the EPAM colors around a white card, magenta text and
 * burgundy buttons. The card stays light in the dark theme too, like the other original pages.
 */
export default function QuizGame() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  const ending = getEnding(state)
  const current = state.status === 'playing' ? state.current : null
  const start = () => dispatch({ type: 'start', questions, random })

  return (
    <div className="rounded-3xl bg-linear-to-r from-[#fc098f] via-[#39c2d7] to-[#a3c644] p-3 sm:p-6">
      <div className="mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-center gap-6 rounded-2xl bg-white p-6 text-center text-slate-700 shadow-lg">
        {state.status === 'idle' && (
          <>
            <Emblem />
            <div>
              <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">Welcome to Rika’s</p>
              <h3 className="mt-1 text-3xl leading-tight font-bold text-[#fc098f] sm:text-4xl">
                “Who Wants to Be a Millionaire?”
              </h3>
              <p className="mt-1 text-xl text-[#fc098f]">game!</p>
            </div>
            <ul className="flex flex-wrap justify-center gap-2 text-sm" aria-label="Rules">
              {RULES.map((rule) => (
                <li key={rule} className="rounded-full bg-[#39c2d7]/15 px-3 py-1 text-[#1b6f7c]">
                  {rule}
                </li>
              ))}
            </ul>
            <GameButton size="large" onClick={start}>
              Start new game
            </GameButton>
          </>
        )}

        {ending && (
          <>
            <p aria-hidden="true" className="text-6xl">
              {ending.emoji}
            </p>
            <p className="text-2xl font-bold text-[#fc098f] sm:text-3xl">{ending.message}</p>
            <GameButton size="large" onClick={start}>
              Start new game
            </GameButton>
          </>
        )}

        {current && (
          <>
            <div className="flex w-full flex-wrap justify-between gap-2 text-sm">
              <span className="rounded-full bg-[#39c2d7]/15 px-3 py-1 text-[#1b6f7c]">
                Total prize: <b data-testid="total-prize">{formatPrize(state.totalPrize)}</b>
              </span>
              <span className="rounded-full bg-[#a3c644]/25 px-3 py-1 text-[#46600f]">
                Prize on current round: <b>{formatPrize(state.roundPrize)}</b>
              </span>
            </div>
            <p className="w-full rounded-2xl border-2 border-[#fc098f]/30 px-5 py-4 text-xl font-semibold text-slate-800 sm:text-2xl">
              {current.question}
            </p>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              {current.answers.map((answer, index) => (
                <button
                  key={answer}
                  type="button"
                  onClick={() => dispatch({ type: 'answer', index, random })}
                  className="group flex cursor-pointer items-center gap-3 rounded-full border-2 border-[#b22746] bg-white py-2 pr-4 pl-2 text-left text-lg text-slate-800 transition-colors hover:bg-[#b22746] hover:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-[#b22746] text-sm font-bold text-white group-hover:bg-white group-hover:text-[#b22746]"
                  >
                    {LETTERS[index]}
                  </span>
                  {answer}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <GameButton
                variant="outline"
                disabled={state.skipUsed}
                onClick={() => dispatch({ type: 'skip', random })}
              >
                Skip question
              </GameButton>
              <GameButton variant="outline" onClick={start}>
                Start new game
              </GameButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** A million-dollar coin in the EPAM colors. */
function Emblem() {
  return (
    <div
      aria-hidden="true"
      className="grid size-24 place-items-center rounded-full bg-[conic-gradient(#fc098f,#39c2d7,#a3c644,#fc098f)] p-1.5 shadow-md"
    >
      <div className="grid size-full place-items-center rounded-full bg-white text-3xl font-bold text-[#b22746]">
        1M
      </div>
    </div>
  )
}

function GameButton({
  children,
  disabled,
  onClick,
  size = 'normal',
  variant = 'filled',
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  size?: 'normal' | 'large'
  variant?: 'filled' | 'outline'
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'cursor-pointer rounded-full border-2 font-semibold transition disabled:cursor-not-allowed',
        size === 'large' ? 'px-8 py-3 text-xl shadow-md hover:-translate-y-0.5' : 'px-5 py-2',
        variant === 'filled'
          ? 'border-[#b22746] bg-[#b22746] text-white hover:bg-[#8e244d]'
          : 'border-[#b22746] text-[#b22746] hover:bg-[#b22746] hover:text-white disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent',
      )}
    >
      {children}
    </button>
  )
}
