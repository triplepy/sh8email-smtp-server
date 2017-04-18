/* eslint-disable prefer-arrow-callback*/

require('should');
const sinon = require('sinon');
const config = require('config');

const rp = require('request-promise');

require('../index');
const server = require('../server');
const sendmail = require('../testutils/sendmail');

describe('SMTP server', function() {
  let postStub;
  beforeEach(function () {
    postStub = sinon.stub(rp, 'post').callsFake(option => Promise.resolve(option.body));
  });

  it('should request to create mail to api server', function () {
    const fromAddress = `wonyoungju@${config.host}`;
    const toAddress = `kyunooh@${config.host}`;
    const expected = {
      from: [{
        address: fromAddress,
        name: '',
      }],
      to: [{
        address: toAddress,
        name: '',
      }],
      cc: [],
      bcc: [],
      subject: 'This is a test subject',
      text: 'This is a test text.',
    };
    return sendmail({
      from: fromAddress,
      to: toAddress,
      subject: 'This is a test subject',
      text: 'This is a test text.',
    }).then((response) => {
      postStub.called.should.be.true();
      postStub.callCount.should.equal(1);

      const postStubArg = postStub.args[0][0];
      const { uri, body } = postStubArg;
      uri.should.endWith('/api/mail/create');
      body.subject.should.equal(expected.subject);
      body.text.trim().should.equal(expected.text);
      body.from.should.deepEqual(expected.from);
      body.to.should.deepEqual(expected.to);
      body.cc.should.deepEqual(expected.cc);
      body.bcc.should.deepEqual(expected.bcc);

      return true;
    });
  });

  after(function () {
    server.close();
  });
});