const host = 'sh8.email';

module.exports = {
  host,
  port: 25,
  logLevel: 'info',
  slackErrorLogging: true,
  smtpLogging: false,
  url: `https://${host}`,
};
