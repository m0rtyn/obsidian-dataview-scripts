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
const journey = Math.ceil((NOW - new Date(START_DATE).getTime()) / MS_IN_DAY / 365) - 1 // ?
const journeyProgress = Math.round(
  (NOW - FIVE_YEARS_AGO) / (new Date(`${CUR_YEAR}-12-31`).getTime() - FIVE_YEARS_AGO) * 1000
) / 10

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