const {
  START_DATE,
  MS_IN_WEEK,
  DASH,
  CORRECTED_START_DATE
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

  const weeks = Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_WEEK);
  const weekArr = new Array(weeks).fill(0).map((_, i) => i + 1);

  const result = weekArr.reduce((acc, weekNum) => {
    const currentDate = new Date(getTimestampFromWeekNumber(weekNum));
    const currWeek = DASH;

    const isLastWeekOfYear = currentDate.getMonth() === 11 && currentDate.getDate() === 31;
    const isLastWeekCoverNextYear = currentDate.getMonth() === 0 && currentDate.getDate() <= 6;

    const weekSymbol =
      isLastWeekOfYear || isLastWeekCoverNextYear
        ? '🛑'
        : weekNum < currWeek // -4 is an WORKAROUND to align the end of the year
          ? '✅'
          : '*️⃣'
    const weekLink =
      isLastWeekOfYear || isLastWeekCoverNextYear
        ? `[[${WEEK_LETTER}${weekNum}|${weekSymbol}]]\n`
        : `[[${WEEK_LETTER}${weekNum}|${weekSymbol}]]`

    return `${acc}${weekLink}`
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