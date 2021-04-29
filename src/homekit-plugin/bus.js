const EventEmitter = require('events');

class bus extends EventEmitter {}

module.exports.Bus = bus;
