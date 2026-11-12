export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_IN_WEEK = 7
const PROGRAMMERS_DAY_OF_YEAR = 256

/** 1. Exact age in years (`today` can be passed to reproduce the examples of the task). */
export function getAge(birthDate: Date, today = new Date()) {
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const hadBirthday = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate())
  return hadBirthday ? age : age - 1
}

/** 2. Weekday name of a date or a timestamp. */
export function getWeekDay(date: Date | number) {
  return WEEKDAYS[new Date(date).getDay()] as string
}

/** 3. Programmer's Day is the 256th day of the year: 13 Sep, or 12 Sep in leap years. */
export function getProgrammersDay(year: number) {
  const date = new Date(year, 0, PROGRAMMERS_DAY_OF_YEAR)
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${year} (${getWeekDay(date)})`
}

/** 4. Days left until the next given weekday (case-insensitive). */
export function howFarIs(weekday: string, today = new Date()) {
  const target = WEEKDAYS.findIndex((day) => day.toLowerCase() === weekday.trim().toLowerCase())
  if (target === -1) {
    return `"${weekday}" is not a weekday`
  }
  const name = WEEKDAYS[target]
  const daysLeft = (target - today.getDay() + DAYS_IN_WEEK) % DAYS_IN_WEEK
  return daysLeft === 0 ? `Hey, today is ${name} =)` : `It's ${daysLeft} day(s) left till ${name}.`
}

/** 5. Letters, digits, "_" and "$", not starting with a digit. */
export function isValidIdentifier(name: string) {
  return /^[a-zA-Z_$][\w$]*$/.test(name)
}

/** 6. Capitalizes the first letter of every word. */
export function capitalize(text: string) {
  return text.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
}

/** 7. Letters only, then one of the allowed audio extensions. */
export function isValidAudioFile(fileName: string) {
  return /^[a-zA-Z]+\.(?:mp3|flac|alac|aac)$/.test(fileName)
}

/** 8. #abc and #abcdef colors; longer codes like #abcd are not matched partially. */
export function getHexadecimalColors(text: string) {
  return text.match(/#(?:[\da-f]{6}|[\da-f]{3})\b/gi) ?? []
}

/** 9. At least 8 characters with an uppercase letter, a lowercase letter and a digit. */
export function isValidPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

/** 10. Commas as thousands separators. */
export function addThousandsSeparators(value: number | string) {
  const [integerPart = '', fractionPart] = String(value).split('.')
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return fractionPart === undefined ? grouped : `${grouped}.${fractionPart}`
}
