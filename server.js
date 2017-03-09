const config = require('config');
const winston = require('winston');
const simpleParser = require('mailparser').simpleParser;
// const request = require('request');
const SMTPServer = require('smtp-server').SMTPServer;


const makeSmtpConfig = () => {
  const baseSmtpConfig = {
    name: 'sh8.email SMTP Server',
    disabledCommands: ['AUTH'],
    onData(stream, session, callback) {
      let buffer = Buffer.alloc(0);
      stream.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
      });
      stream.on('end', () => {
        simpleParser(buffer).then((mail) => {
          // TODO Implement rest api logic instead
          winston.debug(mail);
          // request.get(config.url)
          callback();
        }).catch((err) => {
          callback(err);
        });
      });
    },
  };

  const nodeEnv = config.util.getEnv('NODE_ENV');
  if (nodeEnv === 'development') {
    return Object.assign(baseSmtpConfig, {
      logger: true,
    });
  } else if (nodeEnv === 'production') {
    return Object.assign(baseSmtpConfig, {
      // Nothing to do currently.
    });
  }

  throw new Error(`NODE_ENV ${nodeEnv} is not supported.`);
};

const server = new SMTPServer(makeSmtpConfig());
server.on('error', (err) => {
  winston.error(err);
});

module.exports = server;
