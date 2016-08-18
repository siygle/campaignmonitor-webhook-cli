'use strict'

const WebhookHandler = require('./lib/webhook.js')
const argv = require('yargs')
              .usage('Usage: $0 -t [type] -a [action]')
              .alias('t', 'type')
              .describe('t', 'CLI type: webhook')
              .alias('a', 'action')
              .describe('a', 'action')
              .demand(['t', 'a'])
              .help('h')
              .alias('h', 'help')
              .argv

switch (argv.t) {
  case 'webhook':
    WebhookHandler.handler(argv.action, argv)
    break
  default:
    process.exit(1)
}
