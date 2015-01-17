var http = require('http');
var connect = require('connect');
var app = connect();

var TEST_PORT = 15237;

var Bitcoin = require('../');
var bitcoin = new Bitcoin({
  paymentAddress: 'mig4mc6q7PTQ2YZ9ax5YtR4gjARfoqJSZd',
  contract: {
    unit: 'KB',
    amount: 1,
    fee: 0.00000001,
    enrollment: 0
  },
  debug: true
});

app.use( bitcoin.middleware() );

http.createServer( app ).listen( TEST_PORT );
