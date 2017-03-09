const smtpServerConfig = require('../smtp-server-config');

module.exports = {
  host: 'localhost',
  port: 2525,
  smtpServerConfig: smtpServerConfig.development,
  logLevel: 'debug',
};
