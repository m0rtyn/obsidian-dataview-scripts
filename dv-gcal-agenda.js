const calendarId = '9113f7805b887c54ade660cc554a1850ce975319cdbd0e91c3d528038281c989@group.calendar.google.com';
const apiKey = 'AIzaSyCjLC4l4TSahdN1pZ9e6X3djO65-SUl-Mg';
const timeMin = new Date().toISOString();

const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}`;
// https://www.googleapis.com/calendar/v3/calendars/OTExM2Y3ODA1Yjg4N2M1NGFkZTY2MGNjNTU0YTE4NTBjZTk3NTMxOWNkYmQwZTkxYzNkNTI4MDM4MjgxYzk4OUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t/events?key=AIzaSyCjLC4l4TSahdN1pZ9e6X3djO65-SUl-Mg&timeMin=1702988201336
fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data.items)
    const tasksStr = data.items.reduce((acc, i) => {

      return `${acc}\n- [ ] ${i.summary} 📅 ${new Date(i.start.dateTime).toISOString().slice(0, 10)} [🔗](${i.htmlLink})`
    }, '')
    // @ts-expect-error
    dv.paragraph(tasksStr, false)
  });

// created: "2023-12-19T12:02:27.000Z"
// creator: {email: 'zogacc@gmail.com'}
// end: {dateTime: '2023-12-19T22:40:00+02:00', timeZone: 'Europe/Kaliningrad'}
// etag: "\"3406025833666000\""
// eventType: "default"
// guestsCanModify: true
// htmlLink: "https://www.google.com/calendar/event?eid=N2N1N3NwMTJoaGltZGE3MjI1ZjY5cGwybHEgOTExM2Y3ODA1Yjg4N2M1NGFkZTY2MGNjNTU0YTE4NTBjZTk3NTMxOWNkYmQwZTkxYzNkNTI4MDM4MjgxYzk4OUBn"
// iCalUID: "7cu7sp12hhimda7225f69pl2lq@google.com"
// id: "7cu7sp12hhimda7225f69pl2lq"
// kind: "calendar#event"
// organizer: {email: '9113f7805b887c54ade660cc554a1850ce975319cdbd0e91c3d528038281c989@group.calendar.google.com', displayName: 'Test public cal', self: true}
// sequence: 1
// start: {dateTime: '2023-12-19T22:15:00+02:00', timeZone: 'Europe/Kaliningrad'}
// status: "confirmed"
// summary: "test event"
// updated: "2023-12-19T19:08:36.833Z"