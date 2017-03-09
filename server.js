const config = require('config');
const winston = require('winston');
const simpleParser = require('mailparser').simpleParser;
const request = require('request');
const urljoin = require('url-join');
const parseOneAddress = require('email-addresses').parseOneAddress;
const SMTPServer = require('smtp-server').SMTPServer;


const makeSmtpConfig = () => {
  const baseSmtpConfig = {
    name: 'sh8.email SMTP Server',
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, callback) {
      if (!address.address.endsWith(`@${config.host}`)) {
        return callback(new Error(`Only @${config.host} is allowed to receive mail.`));
      }
      return callback(); // accept
    },
    onData(stream, session, callback) {
      let buffer = Buffer.alloc(0);
      stream.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
      });
      stream.on('end', () => {
        simpleParser(buffer).then((mail) => {
          const recipients = session.envelope.rcptTo.map(
            address => parseOneAddress(address.address).local);
          recipients.forEach((recipient) => {
            const apiUrl = urljoin(config.url, `/rest/mail/${recipient}`);
            request.post(apiUrl).form({
              subject: mail.subject,
              // TODO Add more fields. e.g. from, to, cc, bcc, date, text, html, attachments
            }, (error, response, body) => {
              throw error;
            });
          });
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
