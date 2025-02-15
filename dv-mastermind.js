// @ts-nocheck
const { NOW, START_DATE, MS_IN_DAY } = customJS.Const

// function mergeTasks(qTasks, yTasks) {
//   const tasks = []
//   for (let task of yTasks) {
//     tasks.push(task)
//   }
//   for (let task of qTasks) {
//     if (task.outlinks.length > 0) {
//       tasks.find(t => t?.blockId && t.blockId === task.outlinks[0]?.subpath)
//         ?.children.push(task)
//       continue
//     }
//     tasks.push(task)
//   }
//   return tasks
// }

// const currYear = new Date().getFullYear()
// const currQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
//   .toString().padStart(2, '0')
const qTasks = hideSubitems(getTasksByTag('#Q'))
const yTasks = hideSubitems(getTasksByTag("#Y"))
const jTasks = hideSubitems(getTasksByTag("#J"))
const tasks = mergeTasks(qTasks, yTasks, jTasks)


dv.taskList(tasks, false);

function hideSubitems(tasks) {
  for (let task of tasks) {
    console.log(task)
    task.text = task.text.replace(/#want /g, '')
  }
  return tasks
}

function getTasksByTag(tag) {
  return dv.pages('"Logarhythms"')?.file?.tasks
    ?.filter(t => {
      return t.tags.includes(tag)
    })
    ?.sort(t => t.status, "asc") || []
}

function mergeTasks(qTasks, yTasks, jTasks) {
  const complexTasks = []
  const tasks = []

  for (let task of qTasks) {
    if (task.outlinks.length === 0) tasks.push(task)

    yTasks
      .find(t => t?.blockId && t.blockId === task.outlinks[0]?.subpath)
      ?.children.push(task)
  }

  for (let task of yTasks) {
    if (task.outlinks.length > 0) tasks.unshift(task)

    jTasks
      .find(t => t?.blockId && t.blockId === task.outlinks[0]?.subpath)
      ?.children.push(task)
  }

  for (let task of jTasks) {
    if (task?.children?.length > 0) complexTasks.push(task)
    else tasks.unshift(task)
  }

  return complexTasks.concat(tasks)
}