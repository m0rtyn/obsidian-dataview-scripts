const {
  START_DATE,
  MS_IN_WEEK,
  WEEK_NUM,
  CORRECTED_START_DATE,
  W_PREF,
  M_PREF,
  Q_PREF,
  Y_PREF,
} = this.customJS.Const

// @ts-expect-error because moment is only defined in Obsidian with Dataview plugin
const moment = this.moment
const dataview = this.dv

const TWENTY_YEARS = moment(START_DATE).add(15, 'years').format('YYYY-MM-DD')
const FORTY_YEARS = moment(TWENTY_YEARS).add(15, 'years').format('YYYY-MM-DD')
const LINK_TYPE_TO_SYMBOL = {
  currW: '🛑',
  pastW: '✅',
  futureW: '*️⃣',
  m: '🌕',
  q: '🔶',
  y: '🟫',
}

// TODO: add data from obsidan vault via dataview
getLifeCalendarString(START_DATE, 60);

/** 
  * @param {string} startDateStr format: yyyy-MM-dd
  * @param {number} years
  * @returns {void}
*/
function getLifeCalendarString(startDateStr, years, startWeek = 1) {
  const startDate = new Date(startDateStr);
  const endYearTimestamp = new Date(startDateStr).setFullYear(startDate.getFullYear() + years)
  const endDate = new Date(endYearTimestamp);

  const weeksAmount = Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_WEEK);
  const weekArr = new Array(weeksAmount)
    .fill(0)
    .map((_, i) => i + startWeek);

  const fragment = document.createDocumentFragment();
  const container = window?.document
    ?.querySelector('.cm-preview-code-block.cm-embed-block.markdown-rendered > .block-language-dataviewjs.node-insert-event')
  container?.classList.add('life-calendar')
  let row = document.createElement('span');
  row.classList.add('row')

  weekArr.forEach((weekNum, i) => {
    const currDate = new Date(getTimestampFromWeekNumber(weekNum));
    const currWeek = WEEK_NUM;
    const currFullYear = currDate.getFullYear();
    const currMonthNum = currDate.getMonth() + 1
    const daysInCurrMonth = new Date(currFullYear, currMonthNum, 0).getDate()

    const isLastWeekOfMonth = currDate.getDate() >= (daysInCurrMonth - 6)
    const isLastWeekOfYear = currMonthNum === 12 && currDate.getDate() === 31;
    const isLastWeekCoverNextYear = currMonthNum === 1 && currDate.getDate() <= 6;

    const yearNum = String(currFullYear).slice(2) // 2099 -> 99

    const weekType = weekNum === currWeek
      ? 'currW' // Current week
      : weekNum < currWeek
        ? 'pastW' // Past week
        : 'futureW' // Future week

    const weekLink = `${W_PREF}${weekNum}`; // E.g. [[W9999|*️⃣]]
    createCalNode(weekLink, weekType, row);

    if (isLastWeekOfMonth) {
      const monthLink = `${Y_PREF}${yearNum}${M_PREF}${String(currMonthNum).padStart(2, "0")}` // E.g. [[Y99M12|🌕]]
      createCalNode(monthLink, 'm', row);
    }

    if (isLastWeekOfMonth && currMonthNum % 3 === 0) {
      const quarterNum = Math.ceil(currMonthNum / 3)
      const quarterLink = `${Y_PREF}${yearNum}${Q_PREF}${String(quarterNum).padStart(2, "0")}` // E.g. [[Y99Q0H|🔶]]
      createCalNode(quarterLink, 'q', row);

    }

    if (isLastWeekOfYear || isLastWeekCoverNextYear) {
      const yearLink = `${Y_PREF}${currFullYear}` // E.g. [[Y2099|🟫]]
      createCalNode(yearLink, 'y', row);
    }

    if (isLastWeekOfYear || isLastWeekCoverNextYear) {
      fragment.appendChild(row);
      row = document.createElement('span');
      row.classList.add('row')
    }
  });

  container?.appendChild(fragment);
}


function createCalNode(link, type, fragment) {
  const a = document.createElement('a');
  a.href = link;
  a.dataset.href = link;
  a.dataset.tooltipPosition = 'top';
  a.target = '_blank';
  a.rel = 'noopener nofollow';
  a.textContent = LINK_TYPE_TO_SYMBOL[type];

  a.classList.add('internal-link')
  if (type === 'currW') a.classList.add('current-week')

  fragment.appendChild(a);
}


/**
* @param {number} weekNum 
* @returns {number}
 */
function getTimestampFromWeekNumber(weekNum) {
  const timestamp = weekNum * MS_IN_WEEK + new Date(CORRECTED_START_DATE).getTime();
  return timestamp;
}