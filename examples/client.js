var bitcore = require('bitcore');
var PrivateKey = bitcore.PrivateKey;
var PublicKey = bitcore.PublicKey;
var Consumer = require('bitcore-channel').Consumer;

var rest = require('restler');
var async = require('async');

var TEST_PORT = 15237;

var refundAddress = 'mzCXqcsLBerwyoRZzBFQELHaJ1ZtBSxxe6';

var proposal = null;
async.series([
  function(done) {
    rest.get('http://localhost:'+TEST_PORT ).on('complete', function(data, res) {
      console.log( data );
      
      if (res.statusCode === 402) {
        proposal = data;
        return done();
      }
    });
  },
  function(done) {

    var providerKey = new PublicKey( proposal.provider.key );
    
    var consumer = new Consumer({
      providerPublicKey: providerKey.toString(),
      providerAddress: providerKey.toAddress(),
      refundAddress: refundAddress
    });
    
    console.info('Send bitcoins to ' + consumer.fundingAddress.toString() ' to fund the channel');
    // consumer.processFunding([{...}, {...}, {...}]);
    
    var messageToProvider = consumer.setupRefund();

    done();
  }
], function(err, results) {
  console.log('all done');
});
