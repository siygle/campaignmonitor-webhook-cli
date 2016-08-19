#!/usr/bin/env node

'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const handler = require(path.resolve(__dirname, 'lib/handler.js'))

const SUPPORT_TYPE = [
  'auth',
  'get-client',
  'get-list',
  'get-list-webhook',
  'create-list-webhook',
  'delete-list-webhook'
]
const CONF_PATH = path.join(os.homedir(), '.campaignmonitor-webook-cli')

checkSetting()
.then(() => {
  const argv = require('yargs')
  .usage('Usage: $0 -t [type] <options>')
  .alias('t', 'type')
  .describe('t', `CLI type: ${SUPPORT_TYPE.join(',')}`)
  .demand(['t'])
  .help('h')
  .alias('h', 'Show this help and exit')
  .version(require('./package.json').version)
  .argv

  switch (argv.type) {
    case 'auth':
      handler.updateApiToken(argv._[0], handleOutput)
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
      return (err)
      ? reject('Please run login to setup api token first')
      : resolve('pass')
    })
  })
}

function handleOutput (err, result) {
  if (err) {
    process.stdout.write(err)
    process.exit(1)
  } else {
    process.stdout.write(result)
    process.exit(0)
  }
}
