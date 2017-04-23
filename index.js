const winston = require('winston')
const config = require('config')
const server = require('./server')
const slackTransport = require('slack-winston').Slack

/* Set logging level */
winston.level = config.logLevel
if (config.slackErrorLogging) {
  winston.add(slackTransport, {
    domain: 'sh8email',
    token: process.env.SH8_SLACK_TOKEN,
    webhook_url: process.env.SH8_SLACK_WEBHOOK_URL,
    channel: 'sh8-server-error',
    level: 'error',
  })
}
winston.handleExceptions()

/* Run the server */
server.listen(config.port, config.host, () => {
  winston.info(`Server is listening on ${config.host}:${config.port}`)
})
