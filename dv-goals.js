// @ts-nocheck
const getTasksByPath = (path) => dv.page(path).file.tasks
  .sort(t => t.status, "asc")
const hideSubitems = (tasks) => {
  for (let task of tasks) {
    task.children = task.children.filter(st => st.task )
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

// for (let task of qTasks) { 
//   task.children = task.children.filter(st => st.task) 
// }
// for (let task of yTasks) {
//   task.children = task.children.filter(st => st.task )
// }

dv.el('h4', `Quarter`, { attr: {"data-dashboard-hack": true }})
dv.el('h4', `Year`, { attr: {"data-dashboard-hack": true }})
dv.taskList(qTasks, false);
dv.taskList(yTasks, false);
