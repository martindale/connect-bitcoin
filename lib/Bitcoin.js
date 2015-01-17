var Provider = require('bitcore-channel').Provider;
var Accept = require('http-accept');

var Bitcoin = function( config ) {
  if (!config) throw new Error('a configuration must be provided');
  if (!config.contract) throw new Error('missing contract definition');
  
  if (!config.contract.unit) throw new Error('contracts require a unit');
  if (!config.contract.amount) throw new Error('contracts require an amount');
  if (!~config.contract.fee) throw new Error('contracts require a fee');

  var acceptableUnits = ['B', 'KB'];
  
  if (acceptableUnits.indexOf( config.contract.unit ) == -1) {
    throw new Error('contract unit must be one of: ' + JSON.stringify(acceptableUnits) );
  }
  
  if (config.debug) var colors = require('colors');

  this.config = config;
  this.debug = config.debug;
  this.contracts = {};
  this.contract = config.contract;
  this.provider = new Provider({
    network: 'testnet',
    paymentAddress: config.paymentAddress
  });

}

Bitcoin.prototype.middleware = function() {
  var self = this;

  console.log('[connect-bitcoin]'.bold , 'private key' , self.provider.key.toWIF() );
  
  return function(req, res, next) {
    if (self.debug) console.log('[connect-bitcoin]'.bold, req.url , JSON.stringify(self.contract).red );

    res.writeHead( 402 , {
      'Content-Type': 'application/json'
    } );
    
    var message = {
      message: 'You must enter into a smart contract to access this resource',
      contract: self.contract,
      provider: {
        key: self.provider.key.toPublicKey().toString()
      }
    };
    
    res.end( JSON.stringify( message ) , 'utf-8');
  }
};

module.exports = Bitcoin;
