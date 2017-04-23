/* eslint-disable prefer-arrow-callback*/

require('should');
const { extractRecipient } = require('../address');

describe('address.js', function () {
  describe('extractRecipient(address)', function() {
    it('should return recipient and secretCode if the address has secretCode', function() {
      const given = {
        address: 'getogrand__secret1234@sh8.email',
      };
      const expected = {
        recipient: 'getogrand',
        secretCode: 'secret1234',
      };

      extractRecipient(given.address).should.deepEqual(expected);
    });

    it('should return recipient and null as secretCode if the address does not have secretCode', function() {
      const given = {
        address: 'getogrand@sh8.email',
      };
      const expected = {
        recipient: 'getogrand',
        secretCode: null,
      };

      extractRecipient(given.address).should.deepEqual(expected);
    });

    it('should separate recipient and secretCode with no suprises if the address has many separators', function() {
      const given = {
        address: 'getogrand__parts__of__recipient__secret1234@sh8.email',
      };
      const expected = {
        recipient: 'getogrand__parts__of__recipient',
        secretCode: 'secret1234',
      };

      extractRecipient(given.address).should.deepEqual(expected);
    });
  });
});
