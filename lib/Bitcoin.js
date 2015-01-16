var Provider = require('bitcore-channel').Provider;
var Accept = require('http-accept');

var Bitcoin = function(config) {
  if (!config || !config.paymentAddress) throw new Error('you must provide a payment address.');

  var paymentAddress = '';

  this.contracts = {};
  this.provider = new Provider({
    network: 'testnet',
    paymentAddress: config.paymentAddress
  });

}

Bitcoin.prototype.middleware = function(req, res, next) {
  req.headers[''];
}

module.exports = Bitcoin;
