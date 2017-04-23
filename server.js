const config = require('config');
const winston = require('winston');
const simpleParser = require('mailparser').simpleParser;
const rp = require('request-promise');
const urljoin = require('url-join');
const SMTPServer = require('smtp-server').SMTPServer;

const { extractRecipient } = require('./address');


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
          const recipients = session.envelope.rcptTo.map(({ address }) => extractRecipient(address));
          const requests = recipients.map(({ recipient, secretCode }) => {
            const to = mail.to ? mail.to.value : [];
            const from = mail.from ? mail.from.value : [];
            const cc = mail.cc ? mail.cc.value : [];
            const bcc = mail.bcc ? mail.bcc.value : [];
            return rp.post({
              uri: urljoin(config.url, 'api/mail/create'),
              body: {
                subject: mail.subject,
                recipient,
                secretCode,
                to,
                from,
                cc,
                bcc,
                date: mail.date,
                messageId: mail.messageId,
                html: mail.html,
                text: mail.text,
                // TODO Upload attachment files and datas.
              },
              json: true,
            });
          });
          return Promise.all(requests);
        }).then((bodies) => {
          winston.debug(bodies);
          return callback();
        }).catch((err) => {
          winston.error(err);
          callback(err);
        });
      });
    },
  };

  return Object.assign(baseSmtpConfig, {
    logger: config.smtpLogging,
  });
};

const server = new SMTPServer(makeSmtpConfig());
server.on('error', (err) => {
  winston.error(err);
});

module.exports = server;
