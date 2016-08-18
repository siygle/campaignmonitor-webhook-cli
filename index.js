#!/usr/bin/env node

'use strict'

const SUPPORT_TYPE = [
  'login',
  'get-list-webhook'
]
const WebhookHandler = require('./lib/webhook.js')
const argv = require('yargs')
              .usage('Usage: $0 -t [type] <options>')
              .alias('t', 'type')
              .describe('t', `CLI type: ${SUPPORT_TYPE}.join(',')`)
              .demand(['t'])
              .help('h')
              .alias('h', 'Show this help and exit')
              .version(require('./package.json').version)
              .argv

switch (argv.type) {
  case 'login':
    break
  case 'get-list-webhook':
    WebhookHandler.handler({
      type: argv.type
    })
    break
  default:
    process.exit(1)
}
