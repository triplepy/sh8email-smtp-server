const config = require('config');
const winston = require('winston');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const rp = require('request-promise');
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
          const recipients = session.envelope.rcptTo.map((address) => {
            const local = parseOneAddress(address.address).local;
            const secretSeparator = '__';
            const hasSecretCode = lc => _.includes(lc, secretSeparator);
            if (hasSecretCode(local)) {
              const localPieces = local.split(secretSeparator);
              const recipient = localPieces.slice(0, -1);
              const secretCode = _.last(localPieces);
              return {
                recipient,
                secretCode,
              };
            } else {
              return {
                recipient: local,
                secretCode: null,
              };
            }
          });
          const requests = recipients.map(({ recipient, secretCode }) => (
            rp.post({
              uri: urljoin(config.url, `rest/mail/${recipient}`),
              form: {
                // TODO Add more fields. e.g. from, to, cc, bcc, date, text, html, attachments
                subject: mail.subject,
                secretCode,
              },
            })
          ));
          return Promise.all(requests);
        }).then((bodies) => {
          winston.debug(bodies);
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
  } else {
    throw new Error(`NODE_ENV ${nodeEnv} is not supported.`);
  }
};

const server = new SMTPServer(makeSmtpConfig());
server.on('error', (err) => {
  winston.error(err);
});

module.exports = server;
