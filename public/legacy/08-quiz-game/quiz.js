// Game logic of the quiz, without any DOM: every function returns a new game state.
// `random` returns a number in [0, 1) – it is a parameter so the tests can control it.

export const START_PRIZE = 100
export const PRIZE_TO_WIN = 1_000_000
const PRIZE_MULTIPLIER = 2

export const STATUS = {
  PLAYING: 'playing',
  LOST: 'lost',
  WON: 'won',
  OUT_OF_QUESTIONS: 'outOfQuestions',
}

/** Picks a random question from the ones not asked yet, so none can repeat in one game. */
export function drawQuestion(game, random = Math.random) {
  if (game.remaining.length === 0) {
    return { ...game, status: STATUS.OUT_OF_QUESTIONS, current: null }
  }
  const index = Math.floor(random() * game.remaining.length)

  return {
    ...game,
    current: game.remaining[index],
    remaining: game.remaining.filter((_, i) => i !== index),
  }
}

/** Starts a new game with the first prize and a random question. */
export function createGame(questions, random = Math.random) {
  const game = {
    status: STATUS.PLAYING,
    remaining: [...questions],
    current: null,
    totalPrize: 0,
    roundPrize: START_PRIZE,
    isSkipUsed: false,
  }

  return drawQuestion(game, random)
}

/** Replaces the current question; works once per game. */
export function skipQuestion(game, random = Math.random) {
  if (game.status !== STATUS.PLAYING || game.isSkipUsed) {
    return game
  }

  return drawQuestion({ ...game, isSkipUsed: true }, random)
}

/** A correct answer adds the round prize to the total and doubles it, a wrong one ends the game. */
export function answerQuestion(game, answerIndex, random = Math.random) {
  if (game.status !== STATUS.PLAYING || game.current === null) {
    return game
  }
  if (answerIndex !== game.current.correct) {
    return { ...game, status: STATUS.LOST }
  }
  const totalPrize = game.totalPrize + game.roundPrize
  const nextRound = { ...game, totalPrize, roundPrize: game.roundPrize * PRIZE_MULTIPLIER }
  if (totalPrize >= PRIZE_TO_WIN) {
    return { ...nextRound, status: STATUS.WON }
  }

  return drawQuestion(nextRound, random)
}

/** 1000000 → "1,000,000" */
export function formatPrize(prize) {
  return prize.toLocaleString('en-US')
}
