const hap = require('hap-nodejs');
const config = require('./config.json');

const { Accessory, Characteristic, CharacteristicEventTypes, Service } = hap;
const accessoryUuid = hap.uuid.generate('gromers.rollershutter');

class Homekit {
  /**
   * @param {Logger} logger
   * @param {Bus} bus
   */
  constructor(logger, bus) {
    this.logger = logger;

    this.accessory = new Accessory('Roller Shutter', accessoryUuid);
    this.windowCoveringService = new Service.WindowCovering('Roller Shutter');

    this.name = config.defaultName;
    this.position = 100;
    this.targetPosition = -1;
    this.state = true;

    this.bus = bus;
    this.bus.on('new_current_position', (value) => {
      this.position = +value;

      // In the startup fase, a sync message was sent. If target wasn't set, we do it now. Otherwise we could 
      // get funky values when the state is requested.
      if (this.targetPosition === -1) {
        this.targetPosition = this.position;
      }
      
      // Determine if we are active based upon the requested vs the current position
      this.state = this.position !== this.targetPosition;

      this.windowCoveringService.getCharacteristic(Characteristic.CurrentPosition).setValue(this.position);
      this.windowCoveringService.getCharacteristic(Characteristic.On).setValue(this.state);
    });
  }

  initialize() {
    this.windowCoveringService.getCharacteristic(Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback) => {
        this.logger.info(` > Request if the controller is on/off     | ${this.state}`);
        callback(undefined, this.state);
      });
    this.windowCoveringService.getCharacteristic(Characteristic.Name)
      .on(CharacteristicEventTypes.GET, (callback) => {
        this.logger.info(` > Request for the name                    | ${this.name}`);
        callback(undefined, this.name);
      })
      .on(CharacteristicEventTypes.SET, (value, callback) => {
        this.logger.info(` > Request to set the name                 | ${this.name}`);
        this.name = value;
        callback();
      });
    this.windowCoveringService.getCharacteristic(Characteristic.CurrentPosition)
      .on(CharacteristicEventTypes.GET, (callback) => {
        this.logger.info(` > Request for the current position        | ${this.position}`);
        callback(undefined, this.position);
      });
    this.windowCoveringService.getCharacteristic(Characteristic.TargetPosition)
      .on(CharacteristicEventTypes.GET, (callback) => {
        this.logger.info(` > Request for the target position         | ${this.targetPosition}`);
        callback(undefined, this.targetPosition);
      })
      .on(CharacteristicEventTypes.SET, (value, callback) => {
        this.targetPosition = value;
        this.bus.emit('new_target_position', value);
        callback();
      });
    this.bus.emit('plugin_initialized');
  }

  publish() {
    this.accessory.addService(this.windowCoveringService);
    this.accessory.publish({
      username: config.username,
      pincode: config.pin,
      port: config.port,
      category: hap.Categories.WINDOW_COVERING,
    });
    this.bus.emit('plugin_published');
  }
}

module.exports.Homekit = Homekit;
