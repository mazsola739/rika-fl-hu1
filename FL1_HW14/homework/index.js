document.querySelectorAll('nav a')
  .forEach(e => e.addEventListener('click', () => change(e.dataset.id)))


function change(n) {
  let panels = document.querySelectorAll('.task')
  panels.forEach(p => p.classList.remove('active'))
  panels[n - 1].classList.add('active')
}

/* START TASK 1: Your code goes here */
// a version

let table = document.getElementById('table')
let cell
table.addEventListener('click', (e) => {
  cell = e.target
  if (e.target === e.target.parentElement.childNodes[1]) {
    cell.parentElement.classList.add('blue')
  } else if (e.target.innerHTML === 'Special cell') {
    table.classList.add('green')
  } else {
    cell.classList.add('yellow')
  }
})

/*b version 

const ONE = -1
function dirtyColumn(element) {
  element.classList.remove('unselected');
}

let special = document.getElementById('special');
special.onclick = function () {
  let unselected = document.querySelectorAll('.unselected');
  console.log(unselected);
  for (let i = 0; i < unselected.length; i++) {
    unselected[i].classList.add('green');
    dirtyColumn(unselected[i]);
  }
};

let simple = document.getElementsByClassName('simplecol');
for (let t = 0; t < simple.length; t++) {
  simple[t].onclick = function (event) {
    yellowField(event);
  };
}

function yellowField(event) {
  dirtyColumn(event.target);
  event.target.classList.remove('blue');
  event.target.classList.remove('green');
  event.target.classList.add('yellow');
}

let col1 = document.getElementsByClassName('col1');
for (let t = 0; t < col1.length; t++) {
  col1[t].onclick = function (event) {
    selectRow(event);
  };
}

function selectRow(event) {
  let entireRow = event.target.parentNode.children;
  for (let i = 0; i < entireRow.length; i++) {
    dirtyColumn(entireRow[i]);
    entireRow[i].classList.remove('green');
    let originalClasses = Array.from(entireRow[i].classList);
    if (originalClasses.indexOf('yellow') === ONE) {
      entireRow[i].classList.add('blue');
    }
  }
}*/

/* END TASK 1 */

/* START TASK 2: Your code goes here */

const phoneNumb = /^[\\+](380)+(\d){9}$/;
const msg = document.getElementById('msg');
const phonebtn = document.getElementById('phonebtn');
const input = document.getElementById('phone');
let form = document.getElementById('phoneForm');
let userInput = document.getElementById('phone');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validate(input);
});

userInput.addEventListener('keydown', () => {
  invalid(input)
})

const TWELWE = 12

function myFunction() {
  let x = document.getElementById('phone').value;
  if (phoneNumb.test(x)) {
    msg.innerHTML = `<p class='sentvalid'>Data was successfully sent</p>`;
    input.classList.remove('phone');
    phonebtn.classList.remove('inactivebtn');
    phonebtn.classList.add('activebtn');
  }
}

function invalid() {
  msg.innerHTML = `<p class='alertinvalid'>Type number does not follow format +380*********</p>`
  phonebtn.classList.add('inactivebtn')
  phonebtn.classList.remove('activebtn')
}

function validate(input) {
  if (phoneNumb.test(input.value)) {
    msg.innerHTML = `<p class='sentvalid'>Data was successfully sent</p>`;
    phonebtn.classList.remove('inactivebtn')
    phonebtn.classList.add('activebtn')
  } else {
    invalid()
  }
}

/* END TASK 2 */

/* START TASK 3: Your code goes here */

let scoreA = 0;
let scoreB = 0;

const court = document.getElementById('court');
const ball = document.getElementById('ball');

const TWO = 2;

const ballStart = () => {
  ball.style.top = '145px';
  ball.style.right = '280px';
}

court.onclick = function (event) {
  const rect = court.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  ball.style.position = 'absolute';
  ball.style.left = x + 'px';
  ball.style.top = y + 'px';
};

const TIME = 3000

function fading(teamLetter) {
  let fadeMsg = document.getElementById('scorealert');
  fadeMsg.innerHTML = `<p class="score${teamLetter}Team">Team ${teamLetter} Score</p>`
  setTimeout(() => {
    fadeMsg.innerHTML = `<p class="score${teamLetter}Team"></p>`
  }, TIME)
}

let aBasket = document.getElementById('teamA-basket');
let bScoreDisplay = document.getElementById('scoreB');
aBasket.onclick = function () {
  scoreB += 1;
  bScoreDisplay.innerText = scoreB;
  fading('B')
};

let bBasket = document.getElementById('teamB-basket');
let aScoreDisplay = document.getElementById('scoreA');
bBasket.onclick = function () {
  scoreA += 1;
  aScoreDisplay.innerText = scoreA;
  fading('A')
};



/*END TASK 3 */
