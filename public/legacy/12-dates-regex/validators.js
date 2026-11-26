const IDENTIFIER = /^[a-zA-Z_$][\w$]*$/
// A word starts at the beginning of the text or after whitespace, so "don't" stays "Don't".
const WORD_START = /(^|\s)(\S)/g
const AUDIO_FILE = /^[a-zA-Z]+\.(?:mp3|flac|alac|aac)$/
// \b after the code: "#abcd" must not be matched partially as "#abc".
const HEXADECIMAL_COLOR = /#(?:[\da-f]{6}|[\da-f]{3})\b/gi
const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
// A position followed by groups of exactly three digits up to the end of the integer part.
const THOUSANDS_BOUNDARY = /\B(?=(\d{3})+(?!\d))/g

/** Task 5: letters, digits, "_" and "$", not starting with a digit. */
export function isValidIdentifier(name) {
  return IDENTIFIER.test(name)
}

/** Task 6: the first letter of every word in upper case. */
export function capitalize(text) {
  return text.replace(WORD_START, (_match, before, letter) => `${before}${letter.toUpperCase()}`)
}

/** Task 7: a name of letters only with an .mp3, .flac, .alac or .aac extension. */
export function isValidAudioFile(fileName) {
  return AUDIO_FILE.test(fileName)
}

/** Task 8: every #abc and #abcdef color of the text. */
export function getHexadecimalColors(text) {
  return text.match(HEXADECIMAL_COLOR) ?? []
}

/** Task 9: at least 8 characters with an upper case letter, a lower case letter and a digit. */
export function isValidPassword(password) {
  return PASSWORD.test(password)
}

/** Task 10: commas as thousands separators; a decimal part is left alone. */
export function addThousandsSeparators(value) {
  const [integerPart, fractionPart] = String(value).split('.')
  const grouped = integerPart.replace(THOUSANDS_BOUNDARY, ',')

  return fractionPart === undefined ? grouped : `${grouped}.${fractionPart}`
}
