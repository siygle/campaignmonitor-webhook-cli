'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const _ = require('lodash')
const request = require('request')
const debug = require('debug')('campaignmonitor-webook-cli')
const packageVars = require('../package.json').packageVars
const API = 'https://api.createsend.com/api/v3.1'

class CampaignMonitorHandler {
  constructor (token) {
    if (!(this instanceof CampaignMonitorHandler)) {
      return new CampaignMonitorHandler()
    }

    this.token = token
  }

  _apiCall (method, url, options, cb) {
    if (!this.token) {
      cb(new Error('Cannot find token please run --type auth first'))
    }

    if (typeof options === 'function') {
      cb = options
    }

    let reqObj = {
      method: String(method).toUpperCase(),
      url: url,
      auth: {
        user: this.token,
        pass: 'x'
      },
      json: true
    }

    if (typeof options === 'object') {
      if (method === 'GET') {
        reqObj['qs'] = options
      } else {
        reqObj['body'] = options
      }
    }

    debug('resObj', reqObj)
    request(reqObj, (err, resp, body) => {
      if (err) {
        return cb(err)
      } else if (resp.statusCode !== 200) {
        return cb(body)
      } else {
        return cb(null, body)
      }
    })
  }

  updateApiToken (token, cb) {
    fs.writeFile(_getConfPath(), token, {
      encoding: 'utf8',
      flag: 'w'
    }, (err) => {
      return (err) ? cb(err) : cb(null, `token ${token} saved!`)
    })
  }

  getClients (cb) {
    this._apiCall('GET', `${API}/clients.json`, cb)
  }

  getSubscriberLists (clientId, options, cb) {
    this._apiCall('GET', `${API}/clients/${clientId}/lists.json`, (err, data) => {
      if (err) return cb(err)

      if (options.search && data.length > 0) {
        let matchPatten = new RegExp(options.search)
        let filerResult = _.filter(data, (item) => {
          return (item.Name.match(matchPatten) !== null)
        })
        cb(null, filerResult)
      } else {
        cb(null, data)
      }
    })
  }

  showListInfo (listId, cb) {
    this._apiCall('GET', `${API}/lists/${listId}.json`, cb)
  }

  getListWebhook (listId, cb) {
    this._apiCall('GET', `${API}/lists/${listId}/webhooks.json`, cb)
  }

  createListWebhook (argv, cb) {
    let listId = argv[0]
    let events = argv[1].split(',')
    let url = argv[2]

    this._apiCall('POST', `${API}/lists/${listId}/webhooks.json`, {
      Events: events,
      Url: url,
      PayloadFormat: 'json'
    }, cb)
  }

  deleteListWebhook (listId, webhookId, cb) {
    this._apiCall('DELETE', `${API}/lists/${listId}/webhooks/${webhookId}.json`, (err) => {
      return (err) ? cb(err) : cb(null, `List ${listId} webhook ${webhookId} deleted!`)
    })
  }

  testListWebhook (listId, webhookId, cb) {
    this._apiCall('GET', `${API}/lists/${listId}/webhooks/${webhookId}/test.json`, (err) => {
      return (err) ? cb(err) : cb(null, `Sent test request to webhook ${webhookId}`)
    })
  }
}

function _getConfPath () {
  return path.join(os.homedir(), packageVars.CONF)
}

module.exports = {
  GetConf: _getConfPath,
  CampaignMonitorHandler: CampaignMonitorHandler
}
