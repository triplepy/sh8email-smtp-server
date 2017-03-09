const winston = require('winston');
const simpleParser = require('mailparser').simpleParser;

const base = {
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
        callback();
      }).catch((err) => {
        callback(err);
      });
    });
  },
};

module.exports = {
  development: Object.assign(base, {
    logger: true,
  }),
  production: Object.assign(base, {
    // Nothing to do currently.
  }),
};
