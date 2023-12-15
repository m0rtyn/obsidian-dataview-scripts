const {
  START_DATE,
  MS_IN_WEEK,
  DASH,
  CORRECTED_START_DATE
  // @ts-expect-error because customJS is a Obsidian plugin
} = customJS.Const

const W_PREF = 'D' // prefix for the week link. D for "Dash", but can be any letter
const M_PREF = 'S' // prefix for the month link. S for "Sprint".
const Q_PREF = 'M' // prefix for the quarter link. Q for "Marathon".
const Y_PREF = 'U' // prefix for the year link. U for "Ultramarathon".

const lifeCalString = getLifeCalendarString(START_DATE, 63);

// @ts-expect-error because dv is only defined in Obsidian with Dataview plugin
dv.paragraph(lifeCalString, { cls: "life-calendar" });

/** 
  * @param {string} startDateStr format: yyyy-MM-dd
  * @param {number} years format: yyyy
  * @returns {string} format: [[W1|◻️]]...[[W1052|◻️]]
*/
function getLifeCalendarString(startDateStr, years) {
  const startDate = new Date(startDateStr);
  const endYearTimestamp = new Date(startDateStr).setFullYear(startDate.getFullYear() + years)
  const endDate = new Date(endYearTimestamp);

  const weeks = Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_WEEK);
  const weekArr = new Array(weeks).fill(0).map((_, i) => i + 1);

  const result = weekArr.reduce((acc, weekNum) => {
    const currentDate = new Date(getTimestampFromWeekNumber(weekNum));
    const fullYear = currentDate.getFullYear();
    const lengthOfMonth = new Date(fullYear, currentDate.getMonth() + 1, 0).getDate()
    const isLastWeekOfMonth = currentDate.getDate() >= lengthOfMonth - 6

    const currWeek = DASH;

    const isLastWeekOfYear = currentDate.getMonth() === 11 && currentDate.getDate() === 31;
    const isLastWeekCoverNextYear = currentDate.getMonth() === 0 && currentDate.getDate() <= 6;

    const yearNum = String(fullYear).slice(2)

    const weekSymbol = weekNum === currWeek 
      ? '🛑'
      : weekNum < currWeek
        ? '✅'
        : '*️⃣'
    const weekLink = `[[${W_PREF}${weekNum}|${weekSymbol}]]`

    const monthNum = currentDate.getMonth() + 1
    const monthSymbol = '🌕'
    const monthLink = isLastWeekOfMonth ? `[[${Y_PREF}${yearNum}${M_PREF}${String(monthNum).padStart(2, "0")}|${monthSymbol}]]` : ''

    const quarterNum = Math.ceil((currentDate.getMonth() + 1) / 3)
    const quarterSymbol = '🔶'
    const quarterLink = isLastWeekOfMonth && monthNum % 3 === 0
      ? `[[${Y_PREF}${yearNum}${Q_PREF}${String(quarterNum).padStart(2, "0")}|${quarterSymbol}]]`
      : ''

    const yearLink = isLastWeekOfYear || isLastWeekCoverNextYear
      ? `[[${Y_PREF}${fullYear}|🟫]]`
      : ''

    console.log(currentDate.toISOString().slice(0, 10), weekNum, monthNum, quarterNum)
    const newAcc = `${acc}${weekLink}${monthLink}${quarterLink}${yearLink}`
    return isLastWeekOfYear || isLastWeekCoverNextYear
      ? `${newAcc}\n`
      : `${newAcc}`
  }, '');

  return result;
}

/**
 * @param ${number} w$eekNum 
 * @returns {number}
 */
function getTimestampFromWeekNumber(weekNum) {
  const timestamp = weekNum * MS_IN_WEEK + new Date(CORRECTED_START_DATE).getTime();
  return timestamp;
}