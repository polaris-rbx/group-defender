const fetch = require("node-fetch")
class Discord {
  constructor (webhook, groupId) {
    this.webhook = webhook
    this.groupId = groupId
  }
  sendAlert (info, deranked) {
    const log = info.first
    const sendData = {
      username: 'Polaris Group Defender',
      avatar_url: 'https://i.imgur.com/fXBLyRU.png',
      content: '@everyone ALERT: Threat detected',
      embeds: [
        {
          title: `Possible admin abuse detected`,
          description: `**User**: [${log.username}](${`https://www.roblox.com/users/${log.userId}/profile`}) (${log.userId}) \n**Rank**: \`${log.rankName} (${log.rank})\`\n**Number of actions**: ${info.no}\n${deranked ? 'User de-ranked.' : 'Failed to de-rank user!'}\n\n**DO NOT IGNORE THIS ALERT**`,
          color: 11730954,
          url: `https://www.roblox.com/groups/${this.groupId}/-`,
          footer: { text: "Powered by Polaris Group Defender" }
        }
      ],
      tts: true
    }
    fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })
  }
}
module.exports = Discord