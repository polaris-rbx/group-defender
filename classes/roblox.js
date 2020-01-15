// Interfaces with Roblox and provides HTTP requests and the like.
const fetch = require("node-fetch")
const cheerio = require('cheerio')
const util = require("../util")
const LogAction = require("./logAction")

class Roblox {
  constructor (cookie, groupId, demotionRank) {
    this.cookie = cookie
    this.groupId = groupId
    this.demotionRank = demotionRank
    this.init()
  }

  // Run on app start to check all is good.
  async init () {
    try {
      const user = await this.getCurrentUser()
      console.log(`Running as ${user.UserName} with id ${user.UserID}.`)
    } catch (error) {
      console.error(`Failed to get info: Is Cookie expired?`)
    }

  }


  async getCurrentUser () {
    const res = await this.makeRequest(`https://www.roblox.com/mobileapi/userinfo`)
    return res.json()
  }


  async getLog (opt) {
    const body = await this._getPage(opt)
    const rows = body.data
    const logs = []

    for (let i = 0; i < rows.length; i++) {
      const log = new LogAction(rows[i])
      logs.push(log)
    }
    return logs
  }


  async _getPage (opt) {
    let url = `https://groups.roblox.com/v1/groups/${this.groupId}/audit-log`;
    if (opt) {
      const keys = Object.keys(opt)
      for (let i of keys) {
        url = addQueryItem(url, i, opt[i])
      }
    }
    if (!url.includes("limit")) {
      url = addQueryItem(url, "limit", 50)
    }

    let res = await this.makeRequest(url)
    res = await res.json()
    if (!res.errors) {
      return res
    } else {
      if (res.errors && res.errors[0].message === "Authorization has been denied for this request." || res.errors[0].message === "Insufficient permissions to complete the request.") {
        throw new Error(`Account does not have access to audit log of group ${this.groupId}`)
      } else {
        if (res.errors && res.errors[0].message) {
          throw new Error(`Error returned: ${res.errors[0].message} for URL ${url}`)
        } else {
          console.log(res)
          throw new Error(res)
        }
      }
    }
  }


  async getRoleId () {
    const url = `https://groups.roblox.com/v1/groups/${this.groupId}/roles`
    const res = await this.makeRequest(url)

    const parsed = await res.json()
    const roles = parsed.roles

    for (let counter = 0; counter < roles.length; counter++) {
      if (roles[counter].rank === this.demotionRank) {
        return roles[counter].id
      }
    }
    console.error(`Failed to get roleID: Role not found.`)
  }


  async demote (userId) {
    const roleId = await this.getRoleId()
    return await this.setRank(userId, roleId)
  }

  async setRank (userId, newRoleSetId) {
    const csrf = await this.getCsrf()
    const url = `https://groups.roblox.com/v1/groups/${this.groupId}/users/${userId}`

    const headers = {
      'X-CSRF-TOKEN': csrf,
      'Content-Type': 'application/json'
    }
    const body = JSON.stringify({ roleId: newRoleSetId })
    const res = await this.makeRequest(url, {
      method: "PATCH",
      headers,
      body
    })

    if (res.ok) {
      console.log(`Ranked ${userId} in Group ${this.groupId}`)
      return true
    } else {
      // Nope.
      try {
        const parsed = await res.json()
        if (parsed.errors[0].message) {
          console.error(`Error: ${parsed.errors[0].message}`)
        } else {
          console.error(`${parsed.status}: Internal rank error`)
        }
        return false
      } catch (e) {
        console.error(`Failed to parse derank`)
      }
    }
  }


    static getAction (desc) {
      const text = desc.text()
      const params = []
      for (let i = 0; i < util.regex.length; i++) {
        const match = text.match(util.regex[i])
        if (match) {
          for (let j = 1; j < match.length; j++) {
            params.push(match[j])
          }
        }
      }

      const target = desc.find('a').last().attr('href')
      let found = target.match(/\?ID=(\d+)$/)
      if (!found) {
        found = target.match(/^games\/(\d+)\//)
      }
      found = found && parseInt(found[1], 10)
      return {
        target: found,
        params: params
      }

    }


  async getCsrf () {
    const url = 'https://api.roblox.com/sign-out/v1'
    const res = await this.makeRequest(url, {method: 'POST'})

    const CSRF = res.headers.get('x-csrf-token')
    if (CSRF) {
      return CSRF
    } else {
      throw new Error('Did not receive X-CSRF-TOKEN')
    }
  }


  makeRequest (url, options) {
    options = options ? options : { headers: {} }
    if (!options.headers) options.headers = {}

    options.headers.cookie = `.ROBLOSECURITY=${this.cookie}`
    options.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:66.0) Gecko/20100101 Firefox/66.0'
    return fetch(url, options)
  }
}
module.exports = Roblox

function  addQueryItem (string, item, value) {
  if (!string.includes("?")) {
    return `${string}?${item}=${value}`
  } else {
    return `${string}&${item}=${value}`
  }
}