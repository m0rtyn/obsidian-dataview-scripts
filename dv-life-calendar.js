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
  * @returns {string} format: [[W1|◻️]]...[[W9999|◻️]]
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
    const currWeek = WEEK_NUM;
    const currFullYear = currDate.getFullYear();
    const currMonthNum = currDate.getMonth() + 1
    const daysInCurrMonth = new Date(currFullYear, currMonthNum, 0).getDate()

    const isLastWeekOfMonth = currDate.getDate() >= (daysInCurrMonth - 6)
    const isLastWeekOfYear = currMonthNum === 12 && currDate.getDate() === 31;
    const isLastWeekCoverNextYear = currMonthNum === 1 && currDate.getDate() <= 6;

    const yearNum = String(currFullYear).slice(2) // 2099 -> 99

    const weekSymbol = weekNum === currWeek
      ? '🛑' // Current week
      : weekNum < currWeek
        ? '✅' // Past week
        : '*️⃣' // Future week
    const weekLink = weekNum === currWeek 
      ? `<span class="current-week">[[${W_PREF}${weekNum}|${weekSymbol}]]</span>`
      : `[[${W_PREF}${weekNum}|${weekSymbol}]]` // E.g. [[W9999|*️⃣]]

    const monthSymbol = '🌕'
    const monthLink = isLastWeekOfMonth ? `[[${Y_PREF}${yearNum}${M_PREF}${String(currMonthNum).padStart(2, "0")}|${monthSymbol}]]` : '' // E.g. [[Y99M12|🌕]]

    const quarterNum = Math.ceil(currMonthNum / 3)
    const quarterSymbol = '🔶'
    const quarterLink = isLastWeekOfMonth && currMonthNum % 3 === 0
      ? `[[${Y_PREF}${yearNum}${Q_PREF}${String(quarterNum).padStart(2, "0")}|${quarterSymbol}]]` // E.g. [[Y99Q0H|🔶]]
      : ''

    const yearLink = isLastWeekOfYear || isLastWeekCoverNextYear // E.g. [[Y2099|🟫]]
      ? `[[${Y_PREF}${currFullYear}|🟫]]`
      : ''

    const newAcc = `${acc}${weekLink}${monthLink}${quarterLink}${yearLink}` // E.g. [[W9999|*️⃣]][[Y99M12|🌕]][[Y99Q04|🔶]][[Y2099|🟫]]
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