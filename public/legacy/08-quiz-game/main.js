import { questions } from './questions.js'
import {
  answerQuestion,
  createGame,
  formatPrize,
  PRIZE_TO_WIN,
  STATUS,
  skipQuestion,
} from './quiz.js'

const openingText = document.querySelector('.js-opening')
const endText = document.querySelector('.js-end')
const endTitle = document.querySelector('.js-end-title')
const endSubtitle = document.querySelector('.js-end-subtitle')
const questionBox = document.querySelector('.js-question-box')
const questionText = document.querySelector('.js-question')
const answerGrid = document.querySelector('.js-answers')
const answerButtons = answerGrid.querySelectorAll('.js-answer')
const startButton = document.querySelector('.js-start')
const skipButton = document.querySelector('.js-skip')
const prizeBox = document.querySelector('.js-prizes')
const totalPrizeText = document.querySelector('.js-total')
const roundPrizeText = document.querySelector('.js-current')

let game = null

function renderQuestion() {
  questionText.textContent = game.current.question
  answerButtons.forEach((button, index) => {
    button.textContent = game.current.answers[index]
  })
  totalPrizeText.textContent = `Total prize: ${formatPrize(game.totalPrize)}`
  roundPrizeText.textContent = `Prize on current round: ${formatPrize(game.roundPrize)}`
}

function getEndTexts() {
  if (game.status === STATUS.WON) {
    return {
      title: `Congratulations! You won ${formatPrize(PRIZE_TO_WIN)}.`,
      subtitle: 'It was fun! Do you want to play again?',
    }
  }
  if (game.status === STATUS.OUT_OF_QUESTIONS) {
    return {
      title: `Rika ran out of questions! Your prize is: ${formatPrize(game.totalPrize)}`,
      subtitle: 'It was fun! Do you want to play again?',
    }
  }

  return {
    title: `Game over. Your prize is: ${formatPrize(game.totalPrize)}`,
    subtitle: "Let's play again! =)",
  }
}

function render() {
  const isPlaying = game.status === STATUS.PLAYING
  openingText.hidden = true
  questionBox.hidden = !isPlaying
  prizeBox.hidden = !isPlaying
  skipButton.hidden = !isPlaying
  skipButton.disabled = game.isSkipUsed
  endText.hidden = isPlaying

  if (isPlaying) {
    renderQuestion()
    return
  }
  const { title, subtitle } = getEndTexts()
  endTitle.textContent = title
  endSubtitle.textContent = subtitle
}

function startNewGame() {
  game = createGame(questions)
  render()
}

function skipCurrentQuestion() {
  game = skipQuestion(game)
  render()
}

// One listener for the four answers (event delegation).
function handleAnswerClick(event) {
  const button = event.target.closest('.js-answer')
  if (!button || game === null) {
    return
  }
  game = answerQuestion(game, Number(button.dataset.index))
  render()
}

startButton.addEventListener('click', startNewGame)
skipButton.addEventListener('click', skipCurrentQuestion)
answerGrid.addEventListener('click', handleAnswerClick)
