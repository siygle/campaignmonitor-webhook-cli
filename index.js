#!/usr/bin/env node

'use strict'

const fs = require('fs')
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
const CONF_PATH = handler.CONF_PATH()

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
    console.log(argv._, argv._.length)
      if (argv._.length < 1) {
        handleOutput(new Error('Missing api token'))
      } else {
        handler.updateApiToken(argv._[0], handleOutput)
      }
      break
    default:
      process.exit(1)
  }
}).catch((err) => {
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
       : resolve(stat)
    })
  })
}

function handleOutput (err, result) {
  console.log(err, result)
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(result)
    process.exit(0)
  }
}
