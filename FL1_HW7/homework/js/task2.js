let word = prompt('Type your word')
const EVEN_OR_ODD = 2
let middleOfWordIndex = Math.floor(word.length / EVEN_OR_ODD)
let middleOfWord = word.charAt(middleOfWordIndex)
let trimmedWord = word.replace(/\s+/g, '@')
let middleDouble = word.charAt(middleOfWordIndex - 1)


if (trimmedWord !== word || !word) {
    alert(`Invalid value`)
} else {
    if (word.length % EVEN_OR_ODD === 0) {
        if (middleDouble === middleOfWord) {
            alert(`Middle characters are the same`)
        } else {
            alert(`Rika checked it for you!
        The middle of ${word} is:
        ${middleDouble}${middleOfWord}`)
        }
    } else {
        alert(`Rika checked it for you!
The middle of ${word} is:
${middleOfWord}`)
    }
}