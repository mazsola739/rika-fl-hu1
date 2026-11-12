const HUNDRED_PERCENT = 100
const DECIMAL_PLACES = 2

export interface BatteryReport {
  batteries: number
  defectiveRate: number
  defective: number
  working: number
}

function isNumeric(input: string) {
  return input.trim() !== '' && Number.isFinite(Number(input))
}

function round(value: number) {
  return Number(value.toFixed(DECIMAL_PLACES))
}

/** Returns `null` for invalid input: not a number, negative amount or a rate outside 0–100. */
export function checkBatteries(batteriesInput: string, rateInput: string): BatteryReport | null {
  if (!isNumeric(batteriesInput) || !isNumeric(rateInput)) {
    return null
  }

  const batteries = Number(batteriesInput)
  const defectiveRate = Number(rateInput)
  if (batteries < 0 || defectiveRate < 0 || defectiveRate > HUNDRED_PERCENT) {
    return null
  }

  const defective = (batteries * defectiveRate) / HUNDRED_PERCENT
  return {
    batteries,
    defectiveRate,
    defective: round(defective),
    working: round(batteries - defective),
  }
}

export function formatBatteryReport(report: BatteryReport | null) {
  if (!report) {
    return 'Invalid input data'
  }
  return [
    `Amount of batteries: ${report.batteries}`,
    `Defective rate: ${report.defectiveRate}%`,
    `Amount of defective batteries: ${report.defective}`,
    `Amount of working batteries: ${report.working}`,
  ].join('\n')
}

export function getMiddle(input: string) {
  const word = input.trim()
  if (word === '') {
    return 'Invalid value'
  }

  const middle = Math.floor(word.length / 2)
  if (word.length % 2 === 1) {
    return word.charAt(middle)
  }
  if (word.charAt(middle - 1) === word.charAt(middle)) {
    return 'Middle characters are the same'
  }
  return word.slice(middle - 1, middle + 1)
}
