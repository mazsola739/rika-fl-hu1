//Rika's magic numbers :)
const TWO = 2
const THREE = 3
const FOUR = 4
const FIVE = 5
const SEVEN = 7
const EIGHT = 8
const NINE = 9
const ONETHOUSEND_TWOHOUNDRED_FIFTYEIGHT = 1258

/*Task #1
Write a function - isEquals (Rika's thought: maybe isBigger????? - 4th and 7th task link
It should accept two arguments and returns true if first one value equals second one or false
otherwise.
Tip: no need for if/else clause nor ternary operator*/

//should be task from description
function isEquals(x, y) {
    return x === y
}

console.log('task1: ' + isEquals(THREE, THREE)) // => equals

//should be task from example - anyway, i can use it in other task, so i keep both ;D
function isBigger(x, y) {
    return x > y
}

console.log('task1: ' + isBigger(THREE, THREE)) // => false

/*Task #2
Write a function - numberToString
It should accept one argument as a number and return it as a string
Tip: Don’t worry about incoming number – it’s always valid*/

function numberToString(num) {
    return `‘${num}’`
}

console.log('task2: ' + numberToString(ONETHOUSEND_TWOHOUNDRED_FIFTYEIGHT)) // => ‘1258’

/*Task #3
Write a function - storeNames
It should accept an arbitrary number of strings and return an array of that strings*/

function storeNames() {
    let array = new Array(arguments.length)
    for (let i = 0; i < arguments.length; i++) {
        array[i] = arguments[i]
    }
    return array
}

console.log('task3: ' + storeNames('Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy')) // => ['Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy']

/*Task #4
Write a function - getDivision
It should accept two arguments as numbers and return their division.But the function never returns
a value smaller than 1. If second parameter is greater than first one, function will change their
order.
Tip: consider reusing isBigger function*/

function getDivision(x, y) {
    if (isBigger(x, y)) {
        let result = x / y
        if (result < 1) {
            return 1
        } else {
            return result
        }
    } else {
        let result = y / x
        if (result < 1) {
            return 1
        } else {
            return result
        }
    }
}

console.log('task4/a: ' + getDivision(FOUR, 1)) // => 4
console.log('task4/b: ' + getDivision(TWO, EIGHT)) // => 4

/*Task #5
Write a function - negativeCount
It should accept an array of numbers and return the count of negative values from the array.*/

function negativeCount(array) {
    let countNegNumv = 0
    for (let i = 0; i < array.length; ++i) {
        if (array[i] < 0) {
            countNegNumv += 1
        }
    }
    return countNegNumv
}

console.log('task5/a: ' + negativeCount([FOUR, THREE, TWO, NINE])) // => 0
console.log('task5/b: ' + negativeCount([0, -THREE, FIVE, SEVEN])) // => 1

/*Task #6
Write a function – letterCount
It accepts two string arguments and returns an integer of the count of occurrences the 2nd
argument is found in the first one.
If no occurrences can be found, a count of 0 should be returned.*/

function letterCount(arg1, arg2) {
    let num = 0
    for (let i = 0; i < arg1.length; ++i) {
        if (arg1[i] === arg2) {
            num += 1
        }
    }
    return num
}

console.log('task6/a: ' + letterCount('Marry', 'r')) // => 2
console.log('task6/b: ' + letterCount('Barny', 'y')) // => 1
console.log('task6/c: ' + letterCount('', 'z')) // => 0

/*Task #7
Our basketball team(x – our team) completed the championship.The result of each match look like
"x:y".
Results of all matches are recorded in the collection like this: ["95:74", "107:107", "99:110", ...]
Write a function – countPoints
It should accept a collection of football games scores and count the points of our team in the
championship.
Rules for counting points for each match:
• if x > y - 3 points
• if x < y - 0 point
• if x = y - 1 point
Tip: there are 8 matches in the championship (Rika's thought: huh? i think taht is typo =))
• 0 <= x <= 4
• 0 <= y <= 4
• Consider reusing of isBigger function*/

function countPoints(arr) {
    let num = 0
    for (let i = 0; i < arr.length; i += 1) {
        let pointsArray = arr[i].split(':')
        let x = parseInt(pointsArray[0])
        let y = parseInt(pointsArray[1])
        if (isBigger(x, y)) {
            num += THREE
        } else if (isEquals(x, y)) {
            num += 1
        }
    }
    return num
}

console.log('task7: ' + countPoints(['100:90', '110:98', '100:100', '95:46', '54:90', '99:44', '90:90', '111:100'])) // => 17

/*RESTRICTIONS
- Usage of Math object is forbidden;*/