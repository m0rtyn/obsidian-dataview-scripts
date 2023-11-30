// @ts-nocheck
const tasks = dv.page('Log').file.tasks
  .where(t => t.task)
  .where(t => !t.tags.includes('#want')) // to hide "WANTS" (epics) 
  .sort(t => t.status, "asc")
const getTasksByDate = (date) => tasks
  .where(t => t.section.subpath === date)
const capitalize = (s) => s.replace(/\b\w/g, l => l.toUpperCase())

// NOTE: to hide any subitems
for (let task of tasks) { 
  task.children = task.children.filter(st => st.task) 
}

const DATE_1 = "yesterday"
const DATE_2 = "today"

const date1 = dv.date(DATE_1).toFormat('yyyy-MM-dd ccc')
const tasksDate1 = getTasksByDate(date1)
const date2 = dv.date(DATE_2).toFormat('yyyy-MM-dd ccc')
const tasksDate2 = getTasksByDate(date2).where(t => t.status === " ")


dv.el('h4', capitalize(DATE_1), { attr: {"data-dashboard-hack": true }})
dv.el('h4', capitalize(DATE_2), { attr: {"data-dashboard-hack": true }})
dv.taskList(tasksDate1, false);
dv.taskList(tasksDate2, false);