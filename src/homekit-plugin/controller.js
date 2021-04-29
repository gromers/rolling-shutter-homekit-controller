const { Socket } = require('net');

class Controller {
  /**
   * @param {Logger} logger
   * @param {Bus} bus
   */
  constructor(logger, bus) {
    this.logger = logger;
    this.client = new Socket();
    this.bus = bus;
    this.bus.on('new_target_position', (value) => {
      if (this.client) {
        const payload = { type: 'target_position', value: value };
        this.client.write(`${JSON.stringify(payload)}\n`);
      }
    });
  }

  registerListeners() {
    this.client
      .on('connect', () => {
        // broadcast over the bus we connected with the py-server
        this.bus.emit('controller_connected');

        // tell the client we want to now the position
        const payload = { type: 'sync_position' };
        this.client.write(`${JSON.stringify(payload)}\n`);
      })
      .on('data', (data) => {
        try {
          const message = JSON.parse(data);
          if (message.type === 'new_position' || message.type === 'sync_position') {
            this.bus.emit('new_current_position', message.value);
          } else {
            this.bus.emit('unsupported_message', message);
          }
        } catch (e) {
          this.bus.emit('unsupported_data', data);
        }
      })
      .on('close', () => {
        this.bus.emit('controller_disconnected');
      });
  }

  initialize() {
    this.client.connect(10000, '127.0.0.1', () => { });
  }
}

module.exports.Controller = Controller;
