const development = require('./development')

module.exports = Object.assign(development, {
  logLevel: 'info',
  smtpLogging: false,
})
