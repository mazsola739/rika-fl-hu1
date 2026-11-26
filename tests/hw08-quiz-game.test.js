import { describe, expect, it } from 'vitest'
import { questions } from '../public/legacy/08-quiz-game/questions.js'
import {
  answerQuestion,
  createGame,
  drawQuestion,
  formatPrize,
  PRIZE_TO_WIN,
  START_PRIZE,
  STATUS,
  skipQuestion,
} from '../public/legacy/08-quiz-game/quiz.js'

const ANSWER_COUNT = 4
const pickFirst = () => 0
const pickLast = () => 0.999

function answerCorrectly(game) {
  return answerQuestion(game, game.current.correct, pickFirst)
}

function getWrongAnswer(game) {
  return (game.current.correct + 1) % ANSWER_COUNT
}

describe('question bank', () => {
  it('has unique questions with four answers and a valid correct index', () => {
    const texts = new Set(questions.map((question) => question.question))
    expect(texts.size).toBe(questions.length)
    for (const question of questions) {
      expect(question.answers).toHaveLength(ANSWER_COUNT)
      expect(question.correct).toBeGreaterThanOrEqual(0)
      expect(question.correct).toBeLessThan(ANSWER_COUNT)
    }
  })
})

describe('quiz game', () => {
  it('starts with a total of 0, a round prize of 100 and a question', () => {
    const game = createGame(questions, pickFirst)
    expect(game).toMatchObject({
      status: STATUS.PLAYING,
      totalPrize: 0,
      roundPrize: START_PRIZE,
      isSkipUsed: false,
    })
    expect(game.current).toBe(questions[0])
    expect(game.remaining).toHaveLength(questions.length - 1)
  })

  it('draws a random question and removes it from the remaining ones', () => {
    const game = createGame(questions, pickLast)
    expect(game.current).toBe(questions[questions.length - 1])
    expect(game.remaining).not.toContain(game.current)
  })

  it('does not change the question list it gets', () => {
    const copy = [...questions]
    createGame(questions, pickFirst)
    expect(questions).toEqual(copy)
  })

  it('adds the round prize to the total and doubles it after a correct answer', () => {
    const first = answerCorrectly(createGame(questions, pickFirst))
    expect(first).toMatchObject({ status: STATUS.PLAYING, totalPrize: 100, roundPrize: 200 })
    const second = answerCorrectly(first)
    expect(second).toMatchObject({ totalPrize: 300, roundPrize: 400 })
  })

  it('ends the game after a wrong answer and keeps the total prize', () => {
    const game = answerCorrectly(createGame(questions, pickFirst))
    const lost = answerQuestion(game, getWrongAnswer(game), pickFirst)
    expect(lost).toMatchObject({ status: STATUS.LOST, totalPrize: 100 })
    expect(answerQuestion(lost, 0, pickFirst)).toBe(lost)
  })

  it('allows only one skip per game', () => {
    const game = createGame(questions, pickFirst)
    const skipped = skipQuestion(game, pickFirst)
    expect(skipped.isSkipUsed).toBe(true)
    expect(skipped.current).not.toBe(game.current)
    expect(skipped).toMatchObject({ totalPrize: 0, roundPrize: START_PRIZE })
    expect(skipQuestion(skipped, pickFirst)).toBe(skipped)
  })

  it('never repeats a question and is won as soon as the total reaches one million', () => {
    let game = skipQuestion(createGame(questions, Math.random), Math.random)
    const seen = new Set([game.current])
    while (game.status === STATUS.PLAYING) {
      game = answerQuestion(game, game.current.correct, Math.random)
      if (game.status === STATUS.PLAYING) {
        expect(seen.has(game.current)).toBe(false)
        seen.add(game.current)
      }
    }
    expect(game.status).toBe(STATUS.WON)
    expect(game.totalPrize).toBeGreaterThanOrEqual(PRIZE_TO_WIN)
    expect(game.totalPrize - game.roundPrize / 2).toBeLessThan(PRIZE_TO_WIN)
  })

  it('ends the game when the questions run out', () => {
    const game = createGame([questions[0]], pickFirst)
    expect(answerCorrectly(game).status).toBe(STATUS.OUT_OF_QUESTIONS)
    expect(drawQuestion({ ...game, remaining: [] }).status).toBe(STATUS.OUT_OF_QUESTIONS)
  })

  it('formats prizes with thousands separators', () => {
    expect(formatPrize(PRIZE_TO_WIN)).toBe('1,000,000')
    expect(formatPrize(START_PRIZE)).toBe('100')
  })
})
