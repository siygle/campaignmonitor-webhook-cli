'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const request = require('request')
const packageVars = require('../package.json').packageVars
const API = 'https://api.createsend.com/api/v3.1'

let TOKEN = ''

function _setAuth (token) {
  TOKEN = token
}

function _apiCall (method, target, options, cb) {
  if (!TOKEN) {
    cb(new Error())
  }

  if (typeof options === 'function') {
    cb = options
  }

  let reqObj = {
    method: String(method).toUpperCase(),
    url: `${API}/${target}.json`,
    auth: {
      user: TOKEN,
      pass: 'x'
    },
    json: true
  }

  if (typeof options === 'object') {
    if (method === 'GET') {
      reqObj['qs'] = options
    } else {
      reqObj['form'] = options
    }
  }

  console.log('resObj', reqObj)
  request(reqObj, (err, resp, body) => {
    if (err) {
      return cb(err)
    } else if (resp.statusCode !== 200) {
      return cb(body)
    } else {
      return cb(body)
    }
  })
}

function _getClients (cb) {
  _apiCall('GET', 'clients', cb)
}

function getSubscriberLists () {

}

function getListWebhook () {
  return new Promise((resolve, reject) => {

  })
}

function _updateApiToken (token, cb) {
  fs.writeFile(_getConfPath(), token, {
    encoding: 'utf8',
    flag: 'w'
  }, (err) => {
    return (err) ? cb(err) : cb(null, `token ${token} saved!`)
  })
}

function _getConfPath () {
  return path.join(os.homedir(), packageVars.CONF)
}

module.exports = {
  CONF_PATH: _getConfPath,
  setAuth: _setAuth,
  updateApiToken: _updateApiToken,
  getClients: _getClients
}
