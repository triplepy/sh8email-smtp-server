const config = require('config');
const nodemailer = require('nodemailer');

const sendmail = (data) => {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    ignoreTLS: true,
  });
  return transporter.sendMail(data); // returns promise object
};

module.exports = sendmail;

if (require.main === module) {
  sendmail({
    from: `wonyoungju@${config.host}`,
    to: `kyunooh@${config.host}`,
    subject: 'This is a test subject',
    text: 'This is a test text.',
  }).then(() => {
    console.info('Email was sent successfully.');
    return true;
  }).catch((err) => {
    console.error(err);
  });
}
