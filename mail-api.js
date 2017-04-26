const rp = require('request-promise')
const urljoin = require('url-join')
const config = require('config')

const create = (mail, recipients) => {
  const requests = recipients.map(({ recipient, secretCode }) => {
    const to = mail.to ? mail.to.value : []
    const from = mail.from ? mail.from.value : []
    const cc = mail.cc ? mail.cc.value : []
    const bcc = mail.bcc ? mail.bcc.value : []
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
    })
  })
  return Promise.all(requests)
}

exports.create = create
