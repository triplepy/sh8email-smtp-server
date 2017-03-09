const winston = require('winston');
const config = require('config');
const SMTPServer = require('smtp-server').SMTPServer;

/* Set logging level */
winston.level = config.logLevel;

/* Create and run the server */
const server = new SMTPServer(config.smtpServerConfig);
server.on('error', (err) => {
  winston.error(err);
});
server.listen(config.port, config.host, () => {
  winston.info(`Server is listening on localhost:${config.port}`);
});
