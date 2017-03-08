const util = require('util');
const winston = require('winston');
const SMTPServer = require('smtp-server').SMTPServer;

const server = new SMTPServer({
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
});

if (process.env.NODE_ENV !== 'production') {
  // TODO logger 설정 (level을 debug로.)
  // TODO server config 동적으로 변경
}

const port = Number.parseInt(process.env.SH8_SMTP_PORT, 10);
const host = process.env.SH8_SMTP_HOST;
server.on('error', (err) => {
  winston.error(util.inspect(err));
});
server.listen(port, host, () => {
  winston.info(`Server is listening on localhost:${port}`);
});
