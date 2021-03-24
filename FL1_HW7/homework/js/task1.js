let amountOfBatteries = prompt('How many batteries do you have?')
let defectiveRate
let alertMessage = 'Invalid input data'
const HUNDRED = 100
const TWO = 2

if (isNaN(amountOfBatteries) || amountOfBatteries < 0) {
    alert(alertMessage)
} else {
    defectiveRate = prompt('What percentage of the batteries are defective?')
}

let amountOfDefectiveBatteries = HUNDRED * defectiveRate / amountOfBatteries
let answerOfDefectiveBatteries = amountOfDefectiveBatteries.toFixed(TWO)
let roundedOfDefectiveBatteries = Math.round(answerOfDefectiveBatteries)

if (isNaN(defectiveRate) || defectiveRate < 0 || defectiveRate > HUNDRED) {
    alert(alertMessage)
} else {
    if (amountOfDefectiveBatteries === roundedOfDefectiveBatteries) {
        answerOfDefectiveBatteries = amountOfDefectiveBatteries
    }
}

let amountOfWorkingBatteries = amountOfBatteries - answerOfDefectiveBatteries
let answerOfWorking = amountOfWorkingBatteries.toFixed(TWO)
let roundedOfWorking = Math.round(answerOfWorking)

answerOfWorking = amountOfWorkingBatteries === roundedOfWorking ? roundedOfWorking : answerOfWorking

alert(`Rika calculated for you that:
Amount of batteries: ${amountOfBatteries}
Defective rate: ${defectiveRate}%
Amount of defective batteries: ${answerOfDefectiveBatteries}
Amount of working batteries: ${answerOfWorking}`)