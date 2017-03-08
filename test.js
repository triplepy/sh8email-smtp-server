const util = require('util');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 2525,
  ignoreTLS: true,
});
const domain = 'localhost';
transporter.sendMail({
  from: `wonyoungju@${domain}`,
  to: `kyunooh@${domain}`,
  subject: 'This is a test subject',
  text: 'This is a test text.',
}, (err, info) => {
  console.log('Callback in test.js is called.');
  if (err) {
    console.error(util.inspect(err));
  } else {
    console.info('Email was sent successfully.');
    transporter.close();
  }
});
