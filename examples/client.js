var bitcore = require('bitcore');
var PrivateKey = bitcore.PrivateKey;
var PublicKey = bitcore.PublicKey;
var Consumer = require('bitcore-channel').Consumer;

var rest = require('restler');
var async = require('async');

var TEST_PORT = 15237;

var fundingKey = new PrivateKey('cb5dc68fbcaf37f29139b50fa4664b395c03e49deb966e5d49a629af005d0654');
var refundKey = new PrivateKey('b65080da83f59a9bfa03841bc82fd0c0d1e036176b2f2c157eaa9547010a042e');
var commitmentKey = new PrivateKey('f1a140dc9d795c0aa537329379f645eb961fe42f27c660e10676c07ddf18777f');

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
      fundingKey: fundingKey,
      refundKey: refundKey,
      refundAddress: refundKey.toAddress(),
      commitmentKey: commitmentKey,
      providerPublicKey: providerKey,
      providerAddress: providerKey.toAddress()
    });
    
    done();
  }
], function(err, results) {
  console.log('all done');
});
