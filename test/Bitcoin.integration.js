var assert = require('assert');
var http = require('http');
var connect = require('connect');

var TEST_PORT = 15637;
var app = connect();
var server = http.createServer( app );

describe('Bitcoin', function() {
  it('should be require-able', function() {
    var Bitcoin = require('../');
  });

  it('should not accept invalid units', function() {
    var Bitcoin = require('../');
    assert.throws(function() {
      var bitcoin = new Bitcoin({
        paymentAddress: 'mig4mc6q7PTQ2YZ9ax5YtR4gjARfoqJSZd',
        contract: {
          unit: 'not allowed',
          amount: 1,
          fee: 0.00000001
        }
      });
    });
  });

  it('should expose a middleware', function() {
    var Bitcoin = require('../');
    var bitcoin = new Bitcoin({
      paymentAddress: 'mig4mc6q7PTQ2YZ9ax5YtR4gjARfoqJSZd',
      contract: {
        unit: 'KB',
        amount: '1',
        fee: 0.00000001
      }
    });
    
    assert.ok( bitcoin.middleware() );
    
  });
});

describe('middleware', function() {
  
  before(function() {
    var Bitcoin = require('../');
    var bitcoin = new Bitcoin({
      paymentAddress: 'mig4mc6q7PTQ2YZ9ax5YtR4gjARfoqJSZd',
      contract: {
        unit: 'KB',
        amount: '1',
        fee: 0.00000001
      }
    });
    
    app.use( bitcoin.middleware() );
    server.listen( TEST_PORT );
  });
  
  after(function() {
    //server.close();
  });
  
  it('should give status code 402', function( done ) {    
    var options = {
      port: TEST_PORT,
      hostname: '127.0.0.1'
    }
    
    var req = http.request( options , function(res) {
      assert( res.statusCode , 402 );
      done();
    });
    req.end();
  });
  
  it('should correctly describe the contract proposal', function( done ) {
    var options = {
      port: TEST_PORT,
      hostname: '127.0.0.1'
    }
    
    var req = http.request( options , function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        try {
          var response = JSON.parse(body);
        } catch (e) {
          throw new Error('invalid JSON contract');
        }
        
        assert.ok( response.contract.unit );
        assert.ok( response.contract.amount );
        assert.ok( response.contract.fee );

        done();
      });

    });

    req.end();

  });

});
