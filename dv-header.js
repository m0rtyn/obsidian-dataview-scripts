const { 
  MS_IN_DAY,
  START_DATE,
  CORRECTED_START_DATE,
  NOW,
  CUR_YEAR,
  FIVE_YEARS_AGO,
  DIVIDER,
  DASH
// @ts-expect-error because customJS is a Obsidian plugin
} = customJS.Const

/** week  */
const dash = DASH

/** month */
const sprint = new Date().getMonth() + 1
const sprintStr = sprint.toString().padStart(2, '0')
const sprintProgress = Math.ceil((NOW - new Date(new Date().setDate(0)).getTime()) / MS_IN_DAY / 30 * 100)

/** quarter */
const marathonStartDate = `-${(sprint <= 3 ? 1 : sprint <= 6 ? 4 : sprint <= 9 ? 7 : 10).toString().padStart(2, "0")}-01`
const marathon = Math.ceil((new Date().getMonth() + 1) / 3).toString().padStart(2, '0')
const marathonProgress = Math.round((NOW - new Date(CUR_YEAR + marathonStartDate).getTime()) / MS_IN_DAY / 90 * 100)

/** year */
const ultramarathonProgress = Math.round((NOW - new Date(`${CUR_YEAR}-01-01`).getTime()) / MS_IN_DAY / 365 * 100)

/** 5-years period 
 * Journey is a 5 year period which recycles every 5 years from 1993-01-01. 
 * Example of the format: J30 (30%
 */
const ageMs = NOW - new Date(START_DATE).getTime()
const ageYears = ageMs / MS_IN_DAY / 365 // 30, 31, 32...
const journey = Math.ceil(ageYears/5)*5 // 30, 35...
const CEIL = 30
const journeyProgress = Math.round(
  (ageYears-CEIL) / (journey-CEIL)
* 100 * 10) / 10

// @ts-expect-error because Dataview is a Obsidian plugin
const span1 = dv.span(`D${dash}`, { cls: "dashboard-dash"})
// @ts-expect-error
const span2 = dv.span(`S${sprintStr} (${sprintProgress}%)`, { cls: "dashboard-sprint"})
// @ts-expect-error
const span3 = dv.span(`M${marathon} (${marathonProgress}%)`, { cls: "dashboard-marathon"})
// @ts-expect-error
const span4 = dv.span(`U${CUR_YEAR} (${ultramarathonProgress}%)`, { cls: "dashboard-ultramarathon"})
// @ts-expect-error
const span5 = dv.span(`J${journey} (${journeyProgress}%)`, { cls: "dashboard-journey"})
// @ts-expect-error
dv.el(`h2`, [span1, span2, span3, span4, span5], { cls: "dashboard-header"})

const LATITUDE = 46.096958
const LONGITUDE = 19.657539
const SUNSET_API_URL = `https://api.sunrise-sunset.org/json?lat=${LATITUDE}&lng=${LONGITUDE}&formatted=0`
const TIME_ZONE = { timeZone: 'Europe/Belgrade' }
const SUNSET_HEADER_CLASSES = { cls: "dashboard-header sun-clock"}

window.lastSunsetFetch = { date: null, results: null}
let lastSunsetFetchDate = window?.lastSunsetFetch.date
const isMoreThanGapTillLastFetch = lastSunsetFetchDate && Date.now() - lastSunsetFetchDate > 120 * 60 * 1000 
const title = `... of sun is over. ... hours left.`
const header = dv.el(`h2`, title, SUNSET_HEADER_CLASSES)

lastSunsetFetchDate === null 
  ? fetch(SUNSET_API_URL)
    .then(res => res.json())
    .then(data => (renderSunset(data.results), data.results))
    .catch(()=> renderUnknownMessage())
    .finally((results)=> {
      window.lastSunsetFetch = { date: Date.now(), results }
    })
  : isMoreThanGapTillLastFetch 
    ? renderSunset(window.lastSunsetFetch.results)
    : renderUnknownMessage()
  
function renderSunset(results) {
  const hoursInToday = Math.round(results?.day_length / 60 / 60)
  const localSunrise = new Date(new Date(results?.sunrise).toLocaleString('en-US', TIME_ZONE))
  const localSunset = new Date(new Date(results?.sunset).toLocaleString('en-US', TIME_ZONE))
  const hoursSinceSunrise = Math.round((Date.now() - localSunrise.getTime()) / 1000 / 60 / 60)

  const sunnyDayProgress = Math.round(hoursSinceSunrise / hoursInToday * 1000) / 10
  const sunnyDayHours = hoursInToday - hoursSinceSunrise
  const isBeforeSunset = Date.now() <= localSunset.getTime()
  const title = isBeforeSunset 
    ? `${sunnyDayProgress}% of sun is over. ${sunnyDayHours} hours left.` 
    : `Sunset has occured`


  header.replaceWith(dv.el(`h2`, title, SUNSET_HEADER_CLASSES))
}

function renderUnknownMessage() {
  header.replaceWith(dv.el(`h2`, "It seems you're offline", SUNSET_HEADER_CLASSES))
}