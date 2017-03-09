const smtpServerConfig = require('../smtp-server-config');

module.exports = {
  host: 'sh8.email',
  port: 25,
  smtpServerConfig: smtpServerConfig.production,
  logLevel: 'info',
};
