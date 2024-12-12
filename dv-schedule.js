// @ts-nocheck
// NOTE: Obsidian dataviewjs script
// const DIGIT_TIME_REGEX = RegExp(/^\d\d:\d\d(- \d\d:\d\d)?/)

const scheduleItems = dv.page('Log').file.tasks
  .where(t => t.task)
  // .where((item) => {
  //   return RegExp(DIGIT_TIME_REGEX).test(item.text)
  // })

  
  const date2 = dv.date("today").toFormat('yyyy-MM-dd ccc')
  const itemsByDate = getItemsByDate(date2)
  console.log('🛑', itemsByDate, date2)

const formatOpts = { timeStyle: 'short' }
const formattedNow = new Intl.DateTimeFormat('en-GB', formatOpts).format(new Date())
// const itemsBeforeNow = getItemsBeforeNow(itemsByDate)
// const itemsAfterNow = getItemsAfterNow(itemsByDate)
// const isItemsAfterEmpty = itemsAfterNow.length === 0
// const isItemsBeforeEmpty = itemsBeforeNow.length === 0

// if (isItemsAfterEmpty && isItemsBeforeEmpty) {
//   return dv.el('code', 'No plans for today')
// }

// if (!isItemsBeforeEmpty) {
//   dv.el('h4', 'Schedule')
//   itemsBeforeNow && dv.taskList(itemsBeforeNow, false);
// }

// if (!isItemsAfterEmpty) {
// dv.el('span', formattedNow, { cls: "dataview-schedule-time-separator" })
dv.taskList(itemsByDate, false, { cls: "data-dashboard-hack" });
return
// }

dv.el('code', 'No more plans today')



// FUNCTIONS =======================
function getItemsByDate(date) {
  return scheduleItems
    .where(i => i.section.subpath === date)
}

function getItemsBeforeNow(items) {
  return items
    .where(({ text }) => {
      const itemTime = text.match(DIGIT_TIME_REGEX)
      return itemTime?.[0] <= formattedNow
    })
}

function getItemsAfterNow(items) {
  return items
    .where(({ text }) => {
      const itemTime = text.match(DIGIT_TIME_REGEX)
      return itemTime?.[0] > formattedNow
    })
}