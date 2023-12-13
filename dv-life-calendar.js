const {
  START_DATE,
  MS_IN_DAY,
  DASH
// @ts-expect-error because customJS is a Obsidian plugin
} = customJS.Const

const WEEK_LETTER = 'D' // D for "Dash", but can be any letter

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

  const weeks = Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_DAY / 7);
  const weekArr = new Array(weeks).fill(0).map((_, i) => i + 1);

  const result = weekArr.reduce((acc, weekNum) => {
    const currentDate = new Date(getTimestampFromWeekNumber(weekNum));
    const yearHead = `\n${currentDate.getFullYear()}\n`;
    const currWeek = DASH;

    const weekSymbol = weekNum % 52 === 0
      ? '🛑'
      : weekNum < currWeek - 4 // -4 is an WORKAROUND to align the end of the year
        ? '✅'
        : '*️⃣'
    const weekLink =
      weekNum % 52 === 0
        ? `[[${WEEK_LETTER}${weekNum}|${weekSymbol}]]\n`
        : `[[${WEEK_LETTER}${weekNum}|${weekSymbol}]]`

    return `${acc}${weekLink}`
    // return currentDate.getDate() < 7 && currentDate.getMonth() === 0
      // ? `${acc}${weekLink}`
      // : `${acc}${weekLink}`
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