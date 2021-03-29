//Rika's magic numbers :)
const TWO = 2
const THREE = 3
const FOUR = 4
const FIVE = 5
const SIX = 6
const SEVEN = 7
const EIGHT = 8
const TEN = 10
const TWELVE = 12
const THREEHOUNDRED_SIXTYFIVE = 365
const TWENTYTWENTY = 2020

/*1. Write a function that accepts list of numbers either in string or number format and then converts the
values. If it is a string, convert it to number and wise versa. It should return an array of converted values.*/

function convert() {
    let array = new Array(arguments.length)
    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'number') {
            let converted = arguments[i] + ''
            array[i] = converted
        } else {
            let converted = parseInt(arguments[i])
            array[i] = converted
        }
    }
    return array
}

console.log('task1: ' + convert('1', TWO, THREE, '4')) // [1, '2', '3', 4]

/*2. Write function, which iterates over array and executes function on each element.*/
//mentioned to use: 3rd task, 4th task, 8th task, 9th task

function executeforEach(array, func) {
    for (let i = 0; i < array.length; i++) {
        func(array[i])
    }
}

executeforEach([1, TWO, THREE], function (el) {
    console.log('task2: ' + el * TWO)
}) // 2 4 6

/*3. Write function, which returns transformed array based on function, which passed as a second parameter
(callback). If array contains a number as string, it should convert it and return as number. You’re allowed to
change a body of that callback function if you need. Reuse function from task 2.*/

function mapArray(array, func) {
    let newArray = []
    executeforEach(array, (value) => {
        value = parseInt(value)
        newArray.push(func(value))
    })
    return newArray
}

console.log('task3: ' + mapArray([TWO, '5', EIGHT], function (el) {
    return el + THREE
})) // returns [5, 8, 11]

/*4. Write function, which returns filtered array based on function, which passed as a parameter. Reuse
function from task 2.*/

function filterArray(array, func) {
    let filteredArray = []
    executeforEach(array, (value) => {
        if (func(value)) {
            filteredArray.push(value)
        }
    })
    return filteredArray
}

console.log('task4: ' + filterArray([TWO, FIVE, EIGHT], function (el) {
    return el % TWO === 0
})) // returns [2, 8]

/*5. Write a function that takes an array and a value as arguments and returns the value position(not index)
in that array. If value is not present in passed array – return false.*/

function getValuePosition(arrayEl, elToFind) {
    for (let i = 0; i < arrayEl.length; i += 1) {
        if (arrayEl[i] === elToFind) {
            return i + 1
        }
    }
    return false
}

console.log('task5/a: ' + getValuePosition([TWO, FIVE, EIGHT], EIGHT)) // returns 3
console.log('task5/b: ' + getValuePosition([TWELVE, FOUR, SIX], 1)) // returns false

/*6. Write a function that reverses the string value passed into it*/

function flipOver(str) {
    let rev = ''
    const length = str.length - 1
    for (let i = length; i >= 0; i--) {
        rev += str[i]
    }
    return rev
}

console.log('task6: ' + flipOver('hey world')) // 'dlrow yeh'

/*7. Write a function which creates an array from the given range of numbers*/

function makeListFromRange(range) {
    let array = []
    for (let i = range[0]; i <= range[1]; i += 1) {
        array.push(i)
    }
    return array
}

console.log('task7: ' + makeListFromRange([TWO, SEVEN])) // [2, 3, 4, 5, 6, 7]

/*8. Write a function that accepts an array of object and returns new array of values by passed key name.
That function should not change the original array. Reuse function from task 2.*/

function getArrayOfKeys(arrayOfObject, name) {
    let array = []
    executeforEach(arrayOfObject, (value) => {
        array.push(value[name])
    })
    return array
}

const fruits = [
    { name: 'apple', weight: 0.5 },
    { name: 'pineapple', weight: 2 }
]

console.log('task8: ' + getArrayOfKeys(fruits, 'name')) // returns [‘apple’, ‘pineapple’]

/*9. Write a function that accepts an array of groceries objects and returns total weight of all items. Reuse
function from task 2.*/

function getTotalWeight(array) {
    let weight = 0
    executeforEach(array, (value) => {
        weight += value.weight
    })
    return weight
}

const basket = [
    { name: 'Bread', weight: 0.3 },
    { name: 'Coca- Cola', weight: 0.5 },
    { name: 'Watermelon', weight: 8 }
]

console.log('task9: ' + getTotalWeight(basket)) // returns 8.8

/*10. Write a function which returns a day number that was some amount of days ago from the passed date.
It should not change the given source date.*/

const date = new Date(TWENTYTWENTY, 0, TWO)


//diligence =) - exact look in example
function getPastDay2(date, num) {
    let d = new Date(date)
    d.setDate(d.getDate() - num)
    let day = d.getDate()
    let year = d.getFullYear()
    let monthShortN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let monthName = monthShortN[d.getMonth()]
    return `${day}, (${day} ${monthName} ${year})`
}

console.log('task10/a: ' + getPastDay2(date, 1)) // 1, (1 Jan 2020)
console.log('task10/b: ' + getPastDay2(date, TWO)) // 31, (31 Dec 2019)
console.log('task10/c: ' + getPastDay2(date, THREEHOUNDRED_SIXTYFIVE)) // 2, (2 Jan 2019)


//real task - confirmed via Teams by Denys
function getPastDay(date, num) {
    let d = new Date(date)
    d.setDate(d.getDate() - num)
    let day = '' + d.getDate()
    return `${day}`
}

console.log('task10/a: ' + getPastDay(date, 1)) // 1, (1 Jan 2020)
console.log('task10/b: ' + getPastDay(date, TWO)) // 31, (31 Dec 2019)
console.log('task10/c: ' + getPastDay(date, THREEHOUNDRED_SIXTYFIVE)) // 2, (2 Jan 2019)

/*11. Write a function that formats a date in such format "YYYY/MM/DD HH:mm".*/

function addZero(i) {
    if (i < TEN) {
        i = '0' + i;
    }
    return i;
}

function formatDate(date) {
    let d = new Date(date),
        month = addZero('' + (d.getMonth() + 1)),
        day = addZero('' + d.getDate()),
        year = d.getFullYear(),
        hour = addZero(d.getHours()),
        minutes = addZero(d.getMinutes());
    return `${year}/${month}/${day} ${hour}:${minutes}`
}

console.log('task11/a: ' + formatDate(new Date('6/15/2019 09:15:00'))) // "2018/06/15 09:15" - (Rika's thought - right now time traveling impossible, so i guess its an typo =)
console.log('task11/b: ' + formatDate(new Date())) // gets current local time

/*RESTRICTIONS
- Using built–in array or object methods(besides push, length and date methods) is forbidden
- Using built–in string methods (except parseInt) is forbidden
- Using any external libraries is forbidden*/