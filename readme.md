# Polaris group defender [![Polaris project bot](https://img.shields.io/badge/Polaris-Group%20Defender-2bbbad.svg)](https://polaris-bot.xyz)
## About
Polaris group defender is an open source system that aims to prevent Group admin abuse, and make it a thing of the past.
It will detect, prevent, alert and revert abuse.

# Installation and use
## Install
This package can be cloned from this repo or installed from NPM Via: `npm install group-defender`.
## How it works
It scans your group and checks if someone has performed too many actions in the audit log as defined by your threshold. If they have, it demotes the user and alerts you.

## Current features
At present Group defender can detect admin abuse and automatically demote the user, according to given thresholds, and send a webhook alert to Discord.

In future it will support automatic reversion of abuse, but this is not present in v1.

## How to use
One "Group defender" instance is required for each group you want to defend. Example usage:
```js
const GroupDefender = require("group-defender")
const client = new GroupDefender( {
  delay: 60,
  cookie: "Your cookie",
  groupId: "123",
  webhook: "Your Discord webhook URL",
  demotionRank: 1
} )
client.monit()
```
You can make use of the methods manually, or use the `monit` method to automatically check the group.

All time values should be supplied in seconds.

## Creating a client
The module exports the GroupDefender class, which is your primary class. One of these is required for each group, but you can have many clients.
Multi-group clients are not currently supported. You are recommended to simply use the `monit` method to watch your group.
```JS
const GroupDefender = require("group-defender")
const client = new GroupDefender( Your_config )
```

### Config options
- `cookie`: **Required**: Your full Roblox cookie (`.ROBLOSECURITY`). Include the warning, it is recommended that you use a bot account.
- `webhook`: **Required**: Your Discord webhook, which will executed when an attack is detected.
- `groupId`: **Required**: The ID of the group you want to scan and protect.
- `delay`: The delay for the monit function. It will scan your group every `delay` seconds. Default: 60s
- `demotionRank`: The rank which users will be demoted to if they exceed the threshold. Default: 1
- `threshold`: The number of actions which when exceeded, will cause the user to be demoted. Default 10.
- `duration`: The time which that threshold can be reached within. Default 10 minutes, so users can perform 10 actions in 10 minutes.

## Client methods
Once you have a client you can use it's methods, documented below:
### Monit
`GroupDefender.monit(delay?)`

Runs a "scan" of the group and checks that no abuse has taken place. This will be run every `delay` seconds. A delay can be passed, or the value given to the config will be used.

This is the recommended way to make use of this package.


### getRecent
`GroupDefender.getRecent()`

Returns any logs that have taken place since the last time `getRecent` was run. This will return an empty array the first time it is used. 

### updateActions
`GroupDefender.updateActions(Logs)` (Internal)

This takes the logs array outputted by getRecent and updates the action totals. It is not expected to be used outside of the class itself, as it's very niche.

### checkActions
`GroupDefender.checkActions()`

Iterates the actions map and checks if any users are above the threshold value. If they are, it runs the `takeAction` method which demotes them.


### takeAction
`GroupDefender.takeAction(Info)` (Internal)

Takes the information from checkActions(The user's ActionInfo) and deranks them, then sends a webhook.

# Roadmap/To-do
- Support automatic reversion of abuse
- Support multi-group clients
- Improve detection system

# Support
Join our [Discord](https://discord.gg/QevWabU) or DM me on Discord: `Neztore#6998`.
You can also get general Roblox API Support in the [Roblox API](https://discord.gg/EDXNdAT) server.

Alternatively, create an issue on this repo.




-----------------
Credits:
- [Sentanos](https://github.com/sentanos): [Roblox-js](https://github.com/sentanos/roblox-js): Code to get audit log is heavily derived from this package.