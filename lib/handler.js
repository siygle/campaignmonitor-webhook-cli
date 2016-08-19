'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const request = require('request')
const packageVars = require('../package.json').packageVars
const API = 'https://api.createsend.com/api/v3.1/'

function getClients () {

}

function getSubscriberLists () {

}

function getListWebhook () {
  return new Promise((resolve, reject) => {

  })
}

function _updateApiToken (token, cb) {
  console.log(token, cb)
  fs.writeFile(_getConfPath(), token, 'w', cb)
}

function _getConfPath () {
  return path.join(os.homedir(), packageVars.CONF)
}

module.exports = {
  CONF_PATH: _getConfPath,
  updateApiToken: _updateApiToken
}
