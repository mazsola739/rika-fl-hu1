/*global questions*/
//testing console
console.log(questions)
console.log(questions.length)

/*make easier*/
function get(x) {
    return document.getElementById(x)
}
function hide(magic) {
    magic.classList.add('hide')
}
function reveal(magic) {
    magic.classList.remove('hide')
}

//basic stuffs
const startButton = get('startbtn')
const skipButton = get('skipbtn')
const questionDiv = get('question-container')
const prizes = get('result')
const winGameMsg = get('wingame')
const gameOverMsg = get('gameover')
const openMsg = get('openingtext')
const playAgainMsg = get('playagain')
const winPlayAgainMsg = get('wingametext')

//magic numbers
const ZERO = 0
const HUNDRED = 100
const FOUR = 4
const TWO = 2
const ONEMILLION = 1000000

let totalPrize
let currentPrize
let currentQ
let currentA
let randomQIndex

//remove duplicates
function removeDuplicates(data) {
    let result = data.filter(
        (value, index, self) =>
            self.findIndex((m) => m.question === value.question) === index
    )
    return result
}

let filterQ = removeDuplicates(questions)
let qlenght = filterQ.length

console.log(qlenght)

//happend already?
let check = new Array(qlenght)
for (let i = 0; i < qlenght; i++) {
    check[i] = false
}

//clicks
startButton.addEventListener('click', startNewGame)
skipButton.addEventListener('click', skipQ)

//start game, remove hides, show prize, show new question
function startNewGame() {
    reveal(skipButton)
    reveal(questionDiv)
    reveal(prizes)
    hide(gameOverMsg)
    hide(openMsg)
    hide(winGameMsg)
    hide(playAgainMsg)
    hide(winPlayAgainMsg)
    totalPrize = ZERO
    currentPrize = HUNDRED
    showNewQ()
    get('total').innerHTML = 'Total prize: ' + totalPrize
    get('current').innerHTML = 'Prize on current round:' + currentPrize
}
//new question
function showNewQ() {
    randomNewQ()
    currentQ = filterQ[randomQIndex].question
    currentA = filterQ[randomQIndex].correct
    get('questiontext').innerHTML = currentQ
    for (let i = 0; i < FOUR; i++) {
        get('answer' + i).innerHTML = filterQ[randomQIndex].content[i]
    }
}

//skip question, new question, hide skip button
function skipQ() {
    skipButton.classList.add('hide')
    showNewQ()
}

//checking answers, taking care hides
for (let i = 0; i < FOUR; i++) {
    get('answer' + i).onclick = function (event) {
        let isCorrect = checkResult(event.target.getAttribute('data-index'));
        if (isCorrect) {
            showNewQ()
            calculating()
        } else {
            hide(skipButton)
            hide(questionDiv)
            hide(prizes)
            reveal(gameOverMsg)
            reveal(playAgainMsg)
            get('gameover').innerHTML = 'Game over. Your prize is: ' + totalPrize
        }
    }
}
//clickhandler
function checkResult(clickedBtn) {
    if (clickedBtn === filterQ[randomQIndex].correct.toString()) {
        return true
    } else {
        return false
    }
}

//looper for random questions
function looper(i) {
    const unusedQ = check.filter((used) => used === false)
    if (unusedQ.length === 0) {
        return false
    }
    if (check[i] === false) {
        check[i] = true
        return false
    } else {
        return true
    }
}

//random question avoiding duplicates
function randomNewQ() {
    randomQIndex = Math.floor(Math.random() * qlenght)
    let wasItANewQ = looper(randomQIndex)
    while (wasItANewQ) {
        randomQIndex = Math.floor(Math.random() * qlenght)
        wasItANewQ = looper(randomQIndex)
    }
}

//calculating prizes and finishing game handling hides
function calculating() {
    totalPrize += currentPrize
    currentPrize *= TWO
    get('total').innerHTML = 'Total prize: ' + totalPrize
    get('current').innerHTML = 'Prize on current round:' + currentPrize
    if (totalPrize >= ONEMILLION) {
        hide(skipButton)
        hide(questionDiv)
        hide(prizes)
        reveal(winGameMsg)
        reveal(winPlayAgainMsg)
        get('wingame').innerHTML = 'Congratulations! You won ' + ONEMILLION
    }
}
