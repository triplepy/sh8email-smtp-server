const winston = require('winston');
const config = require('config');
const server = require('./server');

/* Set logging level */
winston.level = config.logLevel;

/* Run the server */
server.listen(config.port, config.host, () => {
  winston.info(`Server is listening on ${config.host}:${config.port}`);
});
