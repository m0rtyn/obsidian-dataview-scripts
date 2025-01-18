// @ts-ignore
const items = dv.pages("#want")
  .flatMap(p => p.file.tasks)
  .filter(t => t.tags.includes('#want'))
  // @ts-ignore
  .filter(t => t.due < window.moment().add(3, 'days'))
  .filter(t => t.task)
  .filter(t => t.status === ' ')
  .sort(t => t.due, "desc")
  .limit(20)
  .sort((a,b) => TSH(a.description) - TSH(b.description))
  .limit(1)


const hideSubitems = (tasks) => {
  for (let task of tasks) {
    task.children = task.children.filter(() => false)
  }
  return tasks
}

// @ts-ignore
const button = dv.el('button', false, { cls: "random-task-button" })
button.textContent = 'Get random task'
button.addEventListener('click', () => {
  // @ts-ignore
  dv.taskList(hideSubitems(items), false, { cls: "random-task" })
  button.disabled = true
  button.title = "Сделай сначала полученную задачу"
})

/** random hashing of the tasks  */
function TSH(s) {
  // @ts-ignore
  s = window.moment().format('Y-MM-DD') + ' ' + s
  for(var i=0,h=9; i<s.length;) {
    h=Math.imul(h^s.charCodeAt(i++),9**9)
  };
  return h^h>>>9
};