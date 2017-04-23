const _ = require('lodash');
const config = require('config');
const parseOneAddress = require('email-addresses').parseOneAddress;

const extractRecipient = (address) => {
  const local = parseOneAddress(address).local;
  const hasSecretCode = lc => _.includes(lc, config.secretSeparator);
  if (hasSecretCode(local)) {
    const localPieces = local.split(config.secretSeparator);
    const recipient = _.dropRight(localPieces, 1).join(config.secretSeparator);
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
