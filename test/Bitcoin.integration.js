var assert = require('assert');

describe('Bitcoin', function() {

  it('should be require-able', function() {
    var Bitcoin = require('../');
  });

  it('should expose a middleware', function() {
    var Bitcoin = require('../');
    var bitcoin = new Bitcoin({
      paymentAddress: 'mig4mc6q7PTQ2YZ9ax5YtR4gjARfoqJSZd'
    });
    
    assert.ok( bitcoin.middleware );
    
  });

});
