// // @ts-nocheck
const {
  START_DATE,
  CORRECTED_START_DATE,
  CUR_YEAR,
  MS_IN_DAY,
  DASH
} = customJS.Const

const lifeCalString = getLifeCalendarString(START_DATE, 100);
dv.paragraph(lifeCalString, { cls: "life-calendar" });

/** 
  * @param {string} startDateStr format: yyyy-MM-dd
  * @param {number} years format: yyyy
  * @returns {string} format: [[D1|◻️]]...[[D1052|◻️]]
*/
function getLifeCalendarString(startDateStr, years) {
  const startDate = new Date(startDateStr);
  const endYearTimestamp = new Date(startDateStr).setFullYear(startDate.getFullYear() + years)
  const endDate = new Date(endYearTimestamp);

  const weeks = Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_DAY / 7);
  const weekArr = new Array(weeks).fill(0).map((_, i) => i + 1);

  const result = weekArr.reduce((acc, weekNum) => {
    const currentDate = new Date(getTimestampFromWeekNumber(weekNum));
    const yearHead = `\n${currentDate.getFullYear()}\n`;
    const currWeek = DASH;
    
    const weekSymbol = weekNum % 52 === 0 
      ? '🆑' 
      : weekNum < currWeek 
        ? '✅' 
        : '*️⃣'
    const weekLink = `[[D${weekNum}|${weekSymbol}]]`

    return currentDate.getDate() < 7 && currentDate.getMonth() === 0 && ((currentDate.getFullYear() - 3) % 15 === 0)
      ? `${acc}${yearHead}${weekLink}`
      : `${acc}${weekLink}`
  }, '');

  return result;
}

/**
 * @param {number} weekNum 
 * @returns {number}
 */
function getTimestampFromWeekNumber(weekNum) {
  const timestamp = weekNum * MS_IN_DAY * 7
  return timestamp;
}