// From sentanos
function isDST (time) {
  var today = new Date(time)
  var month = today.getMonth()
  var dow = today.getDay()
  var day = today.getDate()
  var hours = today.getHours()
  if (month < 2 || month > 10) {
    return false
  }
  if (month > 2 && month < 10) {
    return true
  }
  if (dow === 0) {
    if (month === 2) {
      if (day >= 8 && day <= 14) {
        return hours >= 2
      }
    } else if (month === 10) {
      if (day >= 1 && day <= 7) {
        return hours < 2
      }
    }
  }
  var previousSunday = day - dow
  if (month === 2) {
    return previousSunday >= 8
  }
  return previousSunday <= 0
}
function getDate (time, timezone) {
  return new Date(time + ' ' + timezone.substring(0, 1) + (isDST(time) ? 'D' : 'S') + timezone.substring(1))
}
const regex = [
  /rank from (.+) to (.+)\.$/,
  /deleted post "(.+)" by user .+\.$/,
  /changed the group status to: (.*)$/
]
module.exports = {
  getDate, regex
}