class Action {
  constructor (opt) {
    const {
      username,
      userId,
      rank,
      desc,
      date,
      action
    } = opt

    this.username = username
    this.userId = userId
    this.rank = rank
    this.desc = desc
    this.date = new Date(date)
    this.action = action
  }
  get id() {
    return this.date.getTime() + this.desc
  }
}
module.exports = Action