const _ = require('lodash');
const parseOneAddress = require('email-addresses').parseOneAddress;

const extractRecipient = (address) => {
  const local = parseOneAddress(address).local;
  const secretSeparator = '__';
  const hasSecretCode = lc => _.includes(lc, secretSeparator);
  if (hasSecretCode(local)) {
    const localPieces = local.split(secretSeparator);
    const recipient = _.first(localPieces);
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
};

exports.extractRecipient = extractRecipient;
