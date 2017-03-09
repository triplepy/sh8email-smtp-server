const winston = require('winston');

module.exports = {
  development: {
    name: 'sh8.email SMTP Server',
    logger: true,
    disabledCommands: ['AUTH'],
    onData(stream, session, callback) {
      let buffer = Buffer.alloc(0);
      stream.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
      });
      stream.on('end', () => {
        winston.info(buffer.toString());
        callback();
      });
    },
  },
  production: {
    name: 'sh8.email SMTP Server',
    disabledCommands: ['AUTH'],
    // TODO Implement production logic
    // onData(stream, session, callback) {
    //   let buffer = Buffer.alloc(0);
    //   stream.on('data', (chunk) => {
    //     buffer = Buffer.concat([buffer, chunk]);
    //   });
    //   stream.on('end', () => {
    //     winston.info(buffer.toString());
    //     callback();
    //   });
    // },
  },
};
