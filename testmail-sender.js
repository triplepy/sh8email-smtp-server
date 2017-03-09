const config = require('config');
const util = require('util');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  ignoreTLS: true,
});
transporter.sendMail({
  from: `wonyoungju@${config.host}`,
  to: `kyunooh@${config.host}`,
  subject: 'This is a test subject',
  text: 'This is a test text.',
}, (err) => {
  console.log('Callback in test.js is called.');
  if (err) {
    console.error(util.inspect(err));
  } else {
    console.info('Email was sent successfully.');
    transporter.close();
  }
});
