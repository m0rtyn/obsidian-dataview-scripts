// @ts-nocheck
const { NOW, START_DATE, MS_IN_DAY } = customJS.Const

const getTasksByPath = (path) => dv.page(path).file.tasks
  .sort(t => t.status, "asc")
const hideSubitems = (tasks) => {
  for (let task of tasks) {
    task.children = task.children.filter(() => false)
  }
  return tasks
}

const currYear = new Date().getFullYear()
const currQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
  .toString().padStart(2, '0')
const qPagePath = `Logarhythms/U${currYear.toString().slice(2)}M${currQuarter}`
const qTasks = hideSubitems(getTasksByPath(qPagePath))

const yPagePath = `Logarhythms/U${currYear}`
const yTasks = hideSubitems(getTasksByPath(yPagePath))

const currJourney = Math.ceil((NOW - new Date(START_DATE).getTime()) / MS_IN_DAY / 365) - 1
const jPagePath = `Logarhythms/J${currJourney}`
const jTasks = hideSubitems(getTasksByPath(jPagePath))

dv.el('h4', `Marathon`, { attr: { "data-dashboard-hack": true, style: "grid-area: marathon" }})
dv.el('h4', `Ultramarathon`, { attr: { "data-dashboard-hack": true, style: "grid-area: ultramarathon" }})
dv.el('h4', `Journey`,  { attr: { style: "grid-area: journey" }})
dv.taskList(qTasks, false);
dv.taskList(yTasks, false);
dv.taskList(jTasks,  false);

