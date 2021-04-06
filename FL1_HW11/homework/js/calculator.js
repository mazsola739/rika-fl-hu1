function calculator(inputString) {
    function splitStringArithmetic(inputString) {
        let index = 0
        let minusminus = inputString.replaceAll('--', '+'),
            spacingAdd = minusminus.replaceAll('+', ' + '),
            spacingMult = spacingAdd.replaceAll('*', ' * '),
            spacingDiv = spacingMult.replaceAll('/', ' / '),
            spacingSub = spacingDiv.replaceAll('-', ' - '),
            splitArray = spacingSub.split(' ')
        let splitFilterdArray = splitArray.map(elem => {
            if (elem === '') {
                return '0'
            } else {
                return elem
            }
        })
        let filteredArray = splitFilterdArray.filter(Boolean).reduce((array, v, i) => {
            if (isNaN(parseInt(v))) {

                array.push(splitFilterdArray.slice(index, i))
                array.push(v)
                index = i + 1
            }
            return array
        }, [])
        filteredArray.push(splitFilterdArray.slice(index))
        return filteredArray
    }
    function findOperator(array, o) {
        return array.findIndex(i => i === o)
    }
    function arithmetic(o, a, b) {
        a = parseFloat(a)
        b = parseFloat(b)
        let arithmeticObject = {
            '*': a * b,
            '/': a / b,
            '+': a + b,
            '-': a - b
        }
        return arithmeticObject[o]
    }
    function calculate(array, o) {
        let index = findOperator(array, o)
        array[index] = arithmetic(o, array[index - 1], array[index + 1])
        if (isNaN(array[index])) {
            alert(`Rika's CALCULATOR
Invalid expression ${array[index]}`)
        } else {
            return array.filter((c, i) => {
                return i !== index - 1 && i !== index + 1
            })
        }
    }
    function containsOperators(array) {
        return array.some(i => i === '*' || i === '/' || i === '+' || i === '-')
    }
    function simplify(array) {
        while (containsOperators(array)) {
            if (array.includes('*') && array.includes('/')) {
                if (findOperator(array, '/') < findOperator(array, '*')) {
                    array = calculate(array, '/')
                } else {
                    array = calculate(array, '*')
                }
            } else if (array.includes('*')) {
                array = calculate(array, '*')
            } else if (array.includes('/')) {
                array = calculate(array, '/')
            } else if (array.includes('+') && array.includes('-')) {
                if (findOperator(array, '-') < findOperator(array, '+')) {
                    array = calculate(array, '-')
                } else {
                    array = calculate(array, '+')
                }
            } else if (array.includes('+')) {
                array = calculate(array, '+')
            } else if (array.includes('-')) {
                array = calculate(array, '-')
            }
        }
        return array
    }
    let arithmeticArray = splitStringArithmetic(inputString)
    return parseFloat(simplify(arithmeticArray))
}


const INFINITE = true
while (INFINITE) {
    let mathExpression = prompt(`Rika's CALCULATOR
Type your expression below`)
    let match
    mathExpression = mathExpression.replaceAll(' ', '')
    match = mathExpression.match(/(-?)(\d+[-+*\\/])*(\d+)/)
    if (match === null) {
        alert(`Rika's CALCULATOR
Invalid expression`)
    } else {
        alert(`Rika's CALCULATOR
${mathExpression}=${calculator(mathExpression)}`)
    }
}