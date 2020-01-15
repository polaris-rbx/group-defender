class Action {
  constructor (opt) {
    const {
      actor,
      description,
      created,
      actionType
    } = opt

    this.username = actor.user.username
    this.userId = actor.user.userId
    this.rank = actor.role.rank
    this.rankName = actor.role.name

    this.content = description
    this.created = new Date(created)
    this.actionType = actionType

  }
  get id() {
    return this.created.getTime() + this.userId + this.actionType
  }
}
module.exports = Action