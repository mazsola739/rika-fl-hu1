const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_IN_WEEK = 7
const PROGRAMMERS_DAY_OF_YEAR = 256
const JANUARY = 0

/** Task 1: exact age in full years. `today` can be passed to reproduce the task's examples. */
export function getAge(birthDate, today = new Date()) {
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()
  const hadBirthday =
    monthDifference > 0 || (monthDifference === 0 && today.getDate() >= birthDate.getDate())

  return hadBirthday ? age : age - 1
}

/** Task 2: the weekday name of a date or a timestamp. */
export function getWeekDay(date) {
  return WEEKDAYS[new Date(date).getDay()]
}

/** Task 3: "DD Mon, YYYY (weekday)" of the 256th day of the year (13 Sep, 12 Sep in leap years). */
export function getProgrammersDay(year) {
  // Day 256 of January rolls over into September, so leap years are handled by Date itself.
  const date = new Date(year, JANUARY, PROGRAMMERS_DAY_OF_YEAR)

  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${year} (${getWeekDay(date)})`
}

/** Task 4: days left until the next given weekday (case-insensitive input). */
export function howFarIs(weekday, today = new Date()) {
  const targetIndex = WEEKDAYS.findIndex(
    (day) => day.toLowerCase() === String(weekday).trim().toLowerCase(),
  )
  if (targetIndex === -1) {
    return `"${weekday}" is not a weekday`
  }

  const targetName = WEEKDAYS[targetIndex]
  const daysLeft = (targetIndex - today.getDay() + DAYS_IN_WEEK) % DAYS_IN_WEEK
  if (daysLeft === 0) {
    return `Hey, today is ${targetName} =)`
  }

  return `It's ${daysLeft} day(s) left till ${targetName}.`
}
