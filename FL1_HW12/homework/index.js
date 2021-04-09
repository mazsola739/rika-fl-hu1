//Rika's magic numbers ;D
const ONE_TEN = 1234567890
const THREE = 3
const FOUR = 4
const FIVE = 5
const SIX = 6
const SEVEN = 7
const EIGHT = 8
const NINE = 9
const TEN = 10
const TWELVE = 12
const THIRTEEN = 13
const TWENTYTWO = 22
const TWENTYTHREE = 23
const HOUNDRED = 100
const FOURHOUNDRED = 400
const RIKA = 2021
const TWOTHOUSAND = 2000
const TWENTYNINETEEN = 2019
const TWENTYTWENTY = 2020
const TWENTYTWENTYONE = 2021

/*1. Write a function that accepts a person's date of birth as an input and returns the person's exact age
today. For the sake of the task, let’s assume that the input is always a valid date object.*/


function getAge(dateString) {
    let today = new Date(TWENTYTWENTY, NINE, TWENTYTWO)
    let birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    let i = today.getMonth() - birthDate.getMonth()
    if (i < 0 || i === 0 && today.getDate() < birthDate.getDate()) {
        age--
    }
    return age
}

const birthday22 = new Date(TWOTHOUSAND, NINE, TWENTYTWO)
const birthday23 = new Date(TWOTHOUSAND, NINE, TWENTYTHREE)
console.log('task1/a: ' + getAge(birthday22)) // 20 (assuming today is the 22nd October)
console.log('task1/b: ' + getAge(birthday23)) // 19 (assuming today is the 22nd October)

//diligent version
function getAgeReallyToday(dateString) {
    let today = new Date()
    let birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    let i = today.getMonth() - birthDate.getMonth()
    if (i < 0 || i === 0 && today.getDate() < birthDate.getDate()) {
        age--
    }
    return age
}
const firstHomework = new Date(RIKA, 2, 8)
console.log('task1/Rika: ' + getAgeReallyToday(firstHomework)) // the age of my first homework, with today


/*2. Write a function that accepts a date/timestamp and returns a textual representation of the corresponding
weekday (i.e. 'Monday', 'Tuesday', etc.). For the sake of the task, let’s assume that the input is always a valid
date object or a timestamp.*/

function getWeekDay(date) {
    let d = new Date(date)
    let nameOfDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let weekday = nameOfDayName[d.getDay()]
    return `${weekday}`
}

console.log('task2/a: ' + getWeekDay(Date.now())) // "Thursday" (if today is the 22nd October)
console.log('task2/b: ' + getWeekDay(new Date(TWENTYTWENTY, NINE, TWENTYTWO))) // "Thursday"
console.log('task2/Rika: ' + getWeekDay(new Date(RIKA, 2, 8))) // the day of my first deadline

/*3. Write a function that accepts a year as a number and returns the date of Programmer’s Day in the year
specified. The return value should be a string in the following format: ‘DD Mon, YYYY (weekday)’. Reuse the
function from the task 2. The Day of the Programmer is celebrated on the 256th day of each year (on
September 13 during common years and on September 12 in leap years).*/

function getProgrammersDay(numOfYear) {
    function leapYear(year) {
        return year % FOUR === 0 && year % HOUNDRED !== 0 || year % FOURHOUNDRED === 0
    }
    let d
    if (leapYear(numOfYear)) {
        d = new Date(numOfYear, EIGHT, TWELVE)
    } else {
        d = new Date(numOfYear, EIGHT, THIRTEEN)
    }
    let day = d.getDate()
    let year = d.getFullYear()
    let monthShortN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let monthName = monthShortN[d.getMonth()]
    return `${day} ${monthName}, ${year} (${getWeekDay(d)})`
}

console.log('task3/a: ' + getProgrammersDay(TWENTYTWENTY)) // "12 Sep, 2020 (Saturday)"
console.log('task3/b: ' + getProgrammersDay(TWENTYNINETEEN)) // "13 Sep, 2019 (Friday)"
console.log('task3/Rika: ' + getProgrammersDay(RIKA)) // in my Front-end Lab year

/*4. Write a function that accepts a weekday as a string (e.g. ‘Sunday’) and returns the number of days to the
next specified weekday. The input should be case-insensitive. If the specified weekday is today, return `Hey,
today is ${ specifiedWeekday } =)`, otherwise return `It's ${ number } day(s) left till ${ specifiedWeekday }`.
Please note, although input is case-insensitive, weekday name in the output string should be always in proper
case.*/
//i 
function howFarIs(inputWeekDay) {
    let today = new Date(TWENTYTWENTY, NINE, TWENTYTWO)
    let lowInputWeekDay = inputWeekDay.toLowerCase()
    let specifiedWeekday = lowInputWeekDay.replace(/\b\w/g, firstletter => firstletter.toUpperCase())
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let weekday = daysOfWeek[today.getDay()]
    let i = daysOfWeek.indexOf(specifiedWeekday)
    let j = daysOfWeek.indexOf(weekday)
    if (specifiedWeekday === weekday) {
        return `Hey, today is ${specifiedWeekday} =)`
    } else {
        if (i < j) {
            let number = SEVEN - j + i
            return `It's ${number} day(s) left till ${specifiedWeekday}`
        } else if (j < i) {
            let number = i - j
            return `It's ${number}  day(s) left till ${specifiedWeekday}`
        }
    }
}

console.log('task4/a: ' + howFarIs('friday')) // "It's 1 day(s) left till Friday." (on October 22nd)
console.log('task4/b: ' + howFarIs('Thursday')) // "Hey, today is Thursday =)" (on October 22nd)

/*5. Write a function that accepts a string as an input and returns a boolean that defines if the input is a valid
JavaScript variable. Use a regular expression to validate the input. Here is the syntax for valid identifiers:
- each identifier must have at least one character.
- valid identifier characters are the following: alpha, digit, underscore, or dollar sign.
- the first character cannot be a digit.*/

function isValidIdentifier(inputIdent) {
    let varBoolean = /^[a-zA-Z_\\$]+[0-9a-zA-Z_\\$]*$/
    return varBoolean.test(inputIdent)
}

console.log('task5/a: ' + isValidIdentifier('myVar!')) // false
console.log('task5/b: ' + isValidIdentifier('myVar$')) // true
console.log('task5/c: ' + isValidIdentifier('myVar_1')) // true
console.log('task5/d: ' + isValidIdentifier('1_myVar')) // false

/*6. Write a function that accepts a string as an input, capitalizes the first letters of each word and returns the
capitalized string. Use a regular expression to achieve the desired result.*/

function capitalize(testStr) {
    let lowToUp = testStr.replace(/\b\w/g, firstletter => firstletter.toUpperCase())
    return `${lowToUp}`
}

const testStr = 'My name is John Smith. I am 27.'
console.log('task6: ' + capitalize(testStr)) // "My Name Is John Smith. I Am 27.

/*7. Write a function that accepts a string as an input and returns a boolean that defines if the input is a valid
audio file. The file is valid if it satisfies the conditions:
- file name consists of 1+ uppercase and /or lowercase letter(s),
- valid extensions: .mp3, .flac, .alac, or .aac.
Use a regular expression to achieve the desired result.*/

function isValidAudioFile(music) {
    let musicFile = /^[a-zA-Z]+[\\.mp3|\\.flac|\\.alac|\\.aac]{1,}$/
    return musicFile.test(music)
}

console.log('task7/a: ' + isValidAudioFile('file.mp4')) // false
console.log('task7/b: ' + isValidAudioFile('my_file.mp3')) // false
console.log('task7/c: ' + isValidAudioFile('file.mp3')) // true

/*8. Write a function that accepts a string as an input and returns an array of all valid hexadecimal colors
extracted from the string (or an empty array if it does not contain any). Use a regular expression that
matches colors in either #abc or #abcdef format. Please, pay attention to the word boundaries, so that if
the string contains some invalid hexadecimal colors like #eeee, thy will not be parsed partially (i.e. no #eee
in the output array).*/

function getHexadecimalColors(colorStr) {
    let colorsArray = []
    let clearStr = colorStr.replace(/;|:|,/g, '')
    let testStr = /^#(?:[0-9a-fA-F]{3}){1,2}$/
    let colors = clearStr.split(' ')
    for (let i = 0; i < colors.length; i += 1) {
        if (testStr.test(colors[i])) {
            let match = colors[i].match(testStr)[0]
            if (match.length === FOUR || match.length === SEVEN) {
                colorsArray.push(match)
            }
        }
    }
    return colorsArray
}

const testString = 'color: #3f3; background-color: #AA00ef; and: #abcd'
console.log('task8/a: ' + getHexadecimalColors(testString)) // ["#3f3", "#AA00ef"]
console.log('task8/b: ' + getHexadecimalColors('red and #0000')) // []

/*9. Write a simple password validation function that accepts a string as an input and returns either true
(valid) or false (invalid). The password is considered to be valid if it satisfies all of the following
requirements:
- there is at least 1 uppercase letter.
- there is at least 1 lowercase letter.
- there is at least 1 number.
- needs to be at least 8 characters long.*/

function isValidPassword(password) {
    let passwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwRegex.test(password)
}

console.log('task9/a: ' + isValidPassword('agent007')) // false (no uppercase letter)
console.log('task9/b: ' + isValidPassword('AGENT007')) // false (no lowercase letter)
console.log('task9/c: ' + isValidPassword('AgentOOO')) // false (no numbers)
console.log('task9/d: ' + isValidPassword('Age_007')) // false (too short)
console.log('task9/e: ' + isValidPassword('Agent007')) // true


/*10. Write a function that takes a number or a string that can be easily converted to a number, inserts
commas between the numbers as thousands separators and returns the formatted string. Use a regular
expression to achieve the desired result.
addThousandsSeparators("1234567890"); // "1,234,567,890"
addThousandsSeparators(1234567890); // "1,234,567,890"*/

function addThousandsSeparators(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

console.log('task10/a: ' + addThousandsSeparators('1234567890')) // "1,234,567,890"
console.log('task10/b: ' + addThousandsSeparators(ONE_TEN)) // "1,234,567,890"
