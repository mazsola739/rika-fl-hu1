import { describe, expect, it } from 'vitest'
import { questions } from './questions'
import { initialQuizState, type QuizState, quizReducer, START_PRIZE, WINNING_PRIZE } from './quiz'

const first = () => 0

function start() {
  return quizReducer(initialQuizState, { type: 'start', questions, random: first })
}

function answerCorrectly(state: QuizState) {
  return quizReducer(state, { type: 'answer', index: state.current?.correct ?? -1, random: first })
}

describe('quizReducer', () => {
  it('starts with the first prize and a question', () => {
    const state = start()
    expect(state).toMatchObject({ status: 'playing', totalPrize: 0, roundPrize: START_PRIZE })
    expect(state.current).not.toBeNull()
    expect(state.remaining).toHaveLength(questions.length - 1)
  })

  it('adds the prize and doubles it after a correct answer', () => {
    const state = answerCorrectly(start())
    expect(state).toMatchObject({ totalPrize: 100, roundPrize: 200, status: 'playing' })
  })

  it('ends the game after a wrong answer', () => {
    const state = start()
    const wrong = ((state.current?.correct ?? 0) + 1) % 4
    expect(quizReducer(state, { type: 'answer', index: wrong, random: first }).status).toBe('lost')
  })

  it('allows one skip per game', () => {
    const skipped = quizReducer(start(), { type: 'skip', random: first })
    expect(skipped.skipUsed).toBe(true)
    expect(quizReducer(skipped, { type: 'skip', random: first })).toBe(skipped)
  })

  it('never repeats a question and is won at one million', () => {
    let state = start()
    const seen = new Set<string>()
    while (state.status === 'playing' && state.current) {
      expect(seen.has(state.current.question)).toBe(false)
      seen.add(state.current.question)
      state = answerCorrectly(state)
    }
    expect(state.status).toBe('won')
    expect(state.totalPrize).toBeGreaterThanOrEqual(WINNING_PRIZE)
  })

  it('ends the game when the questions run out', () => {
    const [only] = questions
    if (!only) {
      throw new Error('no questions')
    }
    const state = quizReducer(initialQuizState, { type: 'start', questions: [only], random: first })
    expect(answerCorrectly(state).status).toBe('outOfQuestions')
  })
})
