// Takes info from Roblox and processes it. The main class.
const Roblox = require("./roblox")
const Discord = require("./discord")

class GroupDefender {
  constructor (config) {
    this.config = config
    this.roblox = new Roblox(config.cookie, config.groupId, config.demotionRank)
    this.discord = new Discord(config.webhook, config.groupId)
    this.actions = new Map()
    this.duration = config.duration ? config.duration : 600
    this.threshold = config.threshold ? config.threshold : 10
    this.delay = config.delay || 60
  }

  monit (delay) {
    const that = this
    async function run() {
      console.log(`${that.config.groupId}: Monit: Scanning`)
      const recent = await that.getRecent()
      that.updateActions(recent)
      that.checkActions()
    }
    run()
    setInterval(run, (delay || this.delay) * 1000)
  }
  async getRecent () {
    const audit = await this.roblox.getLog()
    if (!this.lastLog) {
      this.lastLog = audit[0]
      return []
    } else {
      let found = false
      let counter = 0
      const newLogs = []
      while (!found && counter < audit.length) {
        if (audit[counter].id === this.lastLog.id) {
          found = true
        } else {
          newLogs.push(audit[counter])
        }
        counter++
      }
      this.lastLog = audit[0]
      return newLogs
    }
  }
  updateActions (logs) {
    for (let log of logs) {
      if (this.actions.has(log.userId)) {
        const old = this.actions.get(log.userId)
        if (log.date.getTime() - old.first.date.getTime() > this.duration * 1000) {
          // It's expired
          this.setDefault(log)
        } else {
          const no = old.no + 1
          this.actions.set(log.userId, {
            first: old.first,
            no: no
          })
        }
      } else {
        // They aren't stored yet. Add default.
        this.setDefault(log)
      }
    }
  }
  // Checks that the threshold has not been exceeded.
  checkActions () {
    for (let value of this.actions.values()) {
      if (value.no > this.threshold) {
        console.log(`User ${value.first.userId} is above threshold.`)
        this.takeAction(value)
      } else {
        console.log(`User ${value.first.userId} is below threshold.`)
      }
    }
  }
  async takeAction (info) {
    console.log(`Taking action against ${info.first.userId}`)
    // Demote user
    const demoted = await this.roblox.demote(info.first.userId)
    // Send webhook
    await this.discord.sendAlert(info, demoted)
    // Update user total
    this.actions.delete(info.first.userId)
    // Attempt to revert (Not Implemented)
  }
  setDefault (log) {
    this.actions.set(log.userId, {
      first: log,
      no: 1
    })
  }

}


module.exports = GroupDefender