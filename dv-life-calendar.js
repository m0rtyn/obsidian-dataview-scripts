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
// @ts-expect-error because moment is only defined in Obsidian with Dataview plugin
const dataview = dv

const TWENTY_YEARS = moment(START_DATE).add(15, 'years').format('YYYY-MM-DD')
const FORTY_YEARS = moment(TWENTY_YEARS).add(15, 'years').format('YYYY-MM-DD')
const LINK_TYPE_TO_SYMBOL = {
  currW: 'current-week',
  pastW: 'past-week',
  futureW: 'future-week',
  m: 'month',
  q: 'quarter',
  y: 'year',
}

// TODO: add data from obsidan vault via dataview
const existedLogs = dataview.pages('"Logarhythms"')
const existedLogNames = new Set(existedLogs.map(f => f.file.name))
const processedLogNames = new Set(existedLogs
  .filter(f => f.file.frontmatter?.processed)
  .map(f => f.file.name))
renderLifeCalendar(START_DATE, 60);

/** 
* @param {string} startDateStr format: yyyy-MM-dd
* @param {number} years
* @returns {void}
*/
function renderLifeCalendar(startDateStr, years, startWeek = 1) {
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

  const loadingIndicator = document.createElement('div')
  loadingIndicator.classList.add('loading-indicator')
  loadingIndicator.textContent = 'LOADING...'
  Promise.resolve().then(() => container?.appendChild(loadingIndicator))

  let row = document.createElement('span');
  row.classList.add('row')

  row = renderSquares(weekArr, row, fragment)

  setTimeout(() => container?.appendChild(fragment), 0)
  setTimeout(() => loadingIndicator.classList.add('hidden'), 500)
}

function renderSquares(weekArr, row, fragment) {
  weekArr.forEach((weekNum, i) => {
    const currDate = new Date(getTimestampFromWeekNumber(weekNum))
    const currWeek = WEEK_NUM
    const currFullYear = currDate.getFullYear()
    const currMonthNum = currDate.getMonth() + 1
    const daysInCurrMonth = new Date(currFullYear, currMonthNum, 0).getDate()

    const isLastWeekOfMonth = currDate.getDate() >= (daysInCurrMonth - 6)
    const isFirstWeekOfMonth = currDate.getDate() <= 7
    const isLastWeekOfYear = currMonthNum === 12 && currDate.getDate() > 31 - 7
    const isFirstWeekOfYear = currMonthNum === 1 && currDate.getDate() <= 7
    const isFirstWeekOfQuarter = currMonthNum % 3 === 1 && currDate.getDate() <= 7
    const isLastWeekCoverNextYear = currMonthNum === 1 && currDate.getDate() <= 6

    const yearNum = String(currFullYear).slice(2) // 2099 -> 99

    const weekType = getWeekType(weekNum, currWeek)

    if (isFirstWeekOfYear) {
      const yearLink = `${Y_PREF}${currFullYear}` // E.g. [[Y2099|🟫]]
      createCalNode(yearLink, 'y', row, i)
    }
    if (isFirstWeekOfQuarter) {
      const quarterNum = Math.ceil(currMonthNum / 3)
      const quarterLink = `${Y_PREF}${yearNum}${Q_PREF}${String(quarterNum).padStart(2, "0")}` // E.g. [[Y99Q0H|🔶]]
      createCalNode(quarterLink, 'q', row, i)
    }
    if (isFirstWeekOfMonth) {
      const monthLink = `${Y_PREF}${yearNum}${M_PREF}${String(currMonthNum).padStart(2, "0")}` // E.g. [[Y99M12|🌕]]
      createCalNode(monthLink, 'm', row, i)
    }

    const weekLink = `${W_PREF}${weekNum}` // E.g. [[W9999|*️⃣]]
    createCalNode(weekLink, weekType, row, i)

    if (isLastWeekOfYear) {
      row = document.createElement('span')
      row.classList.add('row')
      fragment.appendChild(row)
    }
  })
  return row
}

/**
 * 
 * @param {string} link 
 * @param {string} type 
 * @param {any} fragment 
 */
function createCalNode(link, type, fragment, i = 0) {
  const linkYear = type === 'pastW'
    ? getWeekYear(link.slice(1))
    : null
  const weekYear = new Date().getFullYear();

  const square = type !== 'pastW' || weekYear === linkYear
    ? document.createElement('a')
    : document.createElement('div')

  if (square instanceof HTMLAnchorElement) {
    square.dataset.href = "Logarhythms/" + link;
    square.dataset.tooltipPosition = 'top';
    square.href = "Logarhythms/" + link;
    square.target = '_blank';
    square.rel = 'noopener nofollow';
    square.classList.add('internal-link');
  }

  square.classList.add(LINK_TYPE_TO_SYMBOL[type]);

  if (existedLogNames.has(link)) square.classList.add('existed')
  if (processedLogNames.has(link)) square.classList.add('processed')

  if (type === 'y') square.dataset.yearLabel = link;
  if (type === 'q') square.dataset.quarterLabel = link.slice(3);

  fragment.appendChild(square)
}


/**
* @param {number} weekNum 
* @returns {number}
 */
function getTimestampFromWeekNumber(weekNum) {
  const timestamp = weekNum * MS_IN_WEEK + new Date(CORRECTED_START_DATE).getTime();
  return timestamp;
}

/**
 * 
 * @param {string} weekNum 
 * @returns {number}
 */
function getWeekYear(weekNum) {
  const date = new Date(+weekNum * MS_IN_WEEK + new Date(CORRECTED_START_DATE).getTime());
  return date.getFullYear()
}

function getWeekType(weekNum, currWeek) {
  return weekNum === currWeek
    ? 'currW' // Current week
    : weekNum < currWeek
      ? 'pastW' // Past week
      : 'futureW' // Future week
}