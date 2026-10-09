const http = require('node:http');

process.env.NODE_ENV = 'production';
process.env.HOSTNAME = '0.0.0.0';
const port = process.env.PORT || '3000';
if (!/^\d+$/.test(port)) {
  // Passenger auto-binding owns listen; otherwise preserve a socket PORT that Next parses as a number.
  if (!global.PhusionPassenger) {
    const listen = http.Server.prototype.listen;
    http.Server.prototype.listen = function (...args) {
      const callback = args.find(value => typeof value === 'function');
      return callback ? listen.call(this, port, callback) : listen.call(this, port);
    };
  }
  process.env.PORT = '3000';
}

try {
  require('./server.js');
} catch (error) {
  console.error('Stellar startup failed:', error.code || error.name);
  process.exit(1);
}
