#!/usr/bin/env node

'use strict'

const fs = require('fs')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const SUPPORT_TYPE = [
  'auth',
  'get-client',
  'get-list',
  'show-list-info',
  'get-list-webhook',
  'create-list-webhook',
  'delete-list-webhook',
  'test-list-webhook'
]
const CampaignMonitorHandler = require('./lib/handler.js').CampaignMonitorHandler
const CONF_PATH = require('./lib/handler.js').GetConf()

checkSetting()
.then((token) => {
  const argv = require('yargs')
  .usage('Usage: $0 -t [type] <options>')
  .alias('t', 'type')
  .describe('t', `CLI type: ${SUPPORT_TYPE.join(',')}`)
  .demand(['t'])
  .help('h')
  .alias('h', 'Show this help and exit')
  .version(require('./package.json').version)
  .argv

  let campaignMonitor = new CampaignMonitorHandler(token)

  switch (argv.type) {
    case 'auth':
      console.log(argv._, argv._.length)
      if (argv._.length < 1) {
        handleOutput(new Error('Missing api token'))
      } else {
        campaignMonitor.updateApiToken(argv._[0], handleOutput)
      }
      break
    case 'get-client':
      campaignMonitor.getClients(handleOutput)
      break
    case 'get-list':
      // -t get-list [--search keyword] clientID
      campaignMonitor.getSubscriberLists(argv._[0], argv, handleOutput)
      break
    case 'show-list-info':
      // -t show-list-info listID
      campaignMonitor.showListInfo(argv._[0], handleOutput)
      break
    case 'get-list-webhook':
      // -t get-list-webhook listID
      campaignMonitor.getListWebhook(argv._[0], handleOutput)
      break
    case 'create-list-webhook':
      // -t get-list-webhook listID Events(,) Url
      campaignMonitor.createListWebhook(argv._, handleOutput)
      break
    case 'delete-list-webhook':
      // -t get-list-webhook listID webhookID
      campaignMonitor.deleteListWebhook(argv._[0], argv._[1], handleOutput)
      break
    case 'test-list-webhook':
      // -t test-list-webhook listID webhookID
      campaignMonitor.testListWebhook(argv._[0], argv._[1], handleOutput)
      break
    default:
      process.exit(1)
  }
}).catch((err) => {
  console.log(err)
  rl.question('Please input your campaign monitor API TOKEN:', (token) => {
    fs.writeFile(CONF_PATH, token, (err) => {
      if (err) {
        console.log('Cannot write token to config file')
        process.exit(1)
      } else {
        console.log('Write token to config file, you can start using CLI now')
        process.exit(0)
      }
    })
  })
})

function checkSetting () {
  return new Promise((resolve, reject) => {
    fs.stat(CONF_PATH, (err, stat) => {
      if (err) return reject('Please run login to setup api token first')

      fs.readFile(CONF_PATH, (err, result) => {
        if (err) return reject(err)

        let token = result.toString('utf8')
        return resolve(token)
      })
    })
  })
}

function handleOutput (err, result) {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(result)
    process.exit(0)
  }
}
