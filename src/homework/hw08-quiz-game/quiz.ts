import type { Question } from './questions'

export const START_PRIZE = 100
export const WINNING_PRIZE = 1_000_000

export type QuizStatus = 'idle' | 'playing' | 'lost' | 'won' | 'outOfQuestions'

export interface QuizState {
  status: QuizStatus
  /** Questions not shown yet in this game, so none can repeat. */
  remaining: Question[]
  current: Question | null
  totalPrize: number
  roundPrize: number
  skipUsed: boolean
}

/** `random` returns a number in [0, 1) – injected so the reducer stays pure and testable. */
export type QuizAction =
  | { type: 'start'; questions: Question[]; random: () => number }
  | { type: 'answer'; index: number; random: () => number }
  | { type: 'skip'; random: () => number }

export const initialQuizState: QuizState = {
  status: 'idle',
  remaining: [],
  current: null,
  totalPrize: 0,
  roundPrize: START_PRIZE,
  skipUsed: false,
}

function drawQuestion(state: QuizState, random: () => number): QuizState {
  if (state.remaining.length === 0) {
    return { ...state, status: 'outOfQuestions', current: null }
  }
  const index = Math.floor(random() * state.remaining.length)
  return {
    ...state,
    current: state.remaining[index] ?? null,
    remaining: state.remaining.filter((_, i) => i !== index),
  }
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start':
      return drawQuestion(
        { ...initialQuizState, status: 'playing', remaining: [...action.questions] },
        action.random,
      )

    case 'skip':
      if (state.status !== 'playing' || state.skipUsed) {
        return state
      }
      return drawQuestion({ ...state, skipUsed: true }, action.random)

    case 'answer': {
      if (state.status !== 'playing' || !state.current) {
        return state
      }
      if (action.index !== state.current.correct) {
        return { ...state, status: 'lost' }
      }
      const totalPrize = state.totalPrize + state.roundPrize
      const next = { ...state, totalPrize, roundPrize: state.roundPrize * 2 }
      return totalPrize >= WINNING_PRIZE
        ? { ...next, status: 'won' }
        : drawQuestion(next, action.random)
    }
  }
}

export function formatPrize(prize: number) {
  return prize.toLocaleString('en-US')
}
