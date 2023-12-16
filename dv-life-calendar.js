const {
  START_DATE,
  MS_IN_WEEK,
  WEEK_NUM,
  CORRECTED_START_DATE,
  W_PREF,
  M_PREF,
  Q_PREF,
  Y_PREF,
  // @ts-expect-error because customJS is a Obsidian plugin
} = customJS.Const

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

  const weeksAmount = Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_WEEK);
  const weekArr = new Array(weeksAmount)
    .fill(0)
    .map((_, i) => i + 1);

  const result = weekArr.reduce((acc, weekNum) => {
    const currDate = new Date(getTimestampFromWeekNumber(weekNum));
    const fullYear = currDate.getFullYear();
    const currMonthNum = currDate.getMonth() + 1
    const daysInCurrMonth = new Date(fullYear, currMonthNum, 0).getDate()
    const isLastWeekOfMonth = currDate.getDate() >= (daysInCurrMonth - 6)
    const currWeek = WEEK_NUM;

    const isLastWeekOfYear = currMonthNum === 12 && currDate.getDate() === 31;
    const isLastWeekCoverNextYear = currMonthNum === 1 && currDate.getDate() <= 6;

    const yearNum = String(fullYear).slice(2)

    const weekSymbol = weekNum === currWeek 
      ? '🛑'
      : weekNum < currWeek
        ? '✅'
        : '*️⃣'
    const weekLink = `[[${W_PREF}${weekNum}|${weekSymbol}]]`

    const monthSymbol = '🌕'
    const monthLink = isLastWeekOfMonth ? `[[${Y_PREF}${yearNum}${M_PREF}${String(currMonthNum).padStart(2, "0")}|${monthSymbol}]]` : ''

    const quarterNum = Math.ceil(currMonthNum / 3)
    const quarterSymbol = '🔶'
    const quarterLink = isLastWeekOfMonth && currMonthNum % 3 === 0
      ? `[[${Y_PREF}${yearNum}${Q_PREF}${String(quarterNum).padStart(2, "0")}|${quarterSymbol}]]`
      : ''

    const yearLink = isLastWeekOfYear || isLastWeekCoverNextYear
      ? `[[${Y_PREF}${fullYear}|🟫]]`
      : ''

    const newAcc = `${acc}${weekLink}${monthLink}${quarterLink}${yearLink}`
    return isLastWeekOfYear || isLastWeekCoverNextYear
      ? `${newAcc}\n`
      : `${newAcc}`
  }, '');

  return result;
}

/**
 * @param {number} weekNum 
 * @returns {number}
 */
function getTimestampFromWeekNumber(weekNum) {
  const timestamp = weekNum * MS_IN_WEEK + new Date(CORRECTED_START_DATE).getTime();
  return timestamp;
}