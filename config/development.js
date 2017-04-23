const host = 'localhost';

module.exports = {
  host,
  port: 2525,
  logLevel: 'debug',
  slackErrorLogging: false,
  smtpLogging: true,
  url: `http://${host}`,
};
