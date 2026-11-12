import { useReducer } from 'react'
import { cx } from '../../components/ui'
import { questions } from './questions'
import { formatPrize, initialQuizState, type QuizState, quizReducer } from './quiz'

const random = () => Math.random()

function getMessage(state: QuizState) {
  switch (state.status) {
    case 'idle':
      return 'Welcome to Rika’s “Who Wants to Be a Millionaire?” game!'
    case 'lost':
      return `Game over. Your prize is: ${formatPrize(state.totalPrize)}`
    case 'won':
      return `Congratulations! You won ${formatPrize(state.totalPrize)}!`
    case 'outOfQuestions':
      return `No more questions left. Your prize is: ${formatPrize(state.totalPrize)}`
    default:
      return null
  }
}

export default function QuizGame() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  const message = getMessage(state)
  const playing = state.status === 'playing' && state.current

  return (
    <div className="rounded-3xl bg-linear-to-r from-[#fc098f] via-[#39c2d7] to-[#a3c644] p-3 sm:p-6">
      <div className="mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-center gap-6 rounded-2xl bg-white p-6 text-center text-slate-700 shadow-lg dark:bg-slate-900 dark:text-slate-200">
        {message && (
          <div>
            <p className="text-2xl text-[#fc098f] sm:text-3xl">{message}</p>
            <p className="mt-2 text-sm">
              Press “Start new game”{state.status === 'idle' ? '' : ' to play again'}
            </p>
          </div>
        )}

        {playing && state.current && (
          <>
            <p className="text-xl text-[#fc098f] sm:text-2xl">{state.current.question}</p>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              {state.current.answers.map((answer, index) => (
                <button
                  key={answer}
                  type="button"
                  onClick={() => dispatch({ type: 'answer', index, random })}
                  className="cursor-pointer rounded-lg border border-slate-600 bg-[#b22746] px-4 py-3 text-lg text-white hover:bg-[#8e244d]"
                >
                  {answer}
                </button>
              ))}
            </div>
            <dl className="grid grid-cols-[auto_auto] gap-x-2 text-sm text-[#2a9fb1]">
              <dt className="text-right">Total prize:</dt>
              <dd className="text-left font-bold" data-testid="total-prize">
                {formatPrize(state.totalPrize)}
              </dd>
              <dt className="text-right">Prize on current round:</dt>
              <dd className="text-left font-bold">{formatPrize(state.roundPrize)}</dd>
            </dl>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <GameButton onClick={() => dispatch({ type: 'start', questions, random })}>
            Start new game
          </GameButton>
          {playing && (
            <GameButton
              disabled={state.skipUsed}
              onClick={() => dispatch({ type: 'skip', random })}
            >
              Skip question
            </GameButton>
          )}
        </div>
      </div>
    </div>
  )
}

function GameButton({
  children,
  disabled,
  onClick,
}: {
  children: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'rounded-lg border border-slate-600 px-5 py-2 text-lg text-white',
        disabled
          ? 'cursor-not-allowed bg-slate-400'
          : 'cursor-pointer bg-[#b22746] hover:bg-[#8e244d]',
      )}
    >
      {children}
    </button>
  )
}
