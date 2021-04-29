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
    this.windowCoveringService.getCharacteristic(Characteristic.CurrentPosition).setValue(100);
    this.windowCoveringService.getCharacteristic(Characteristic.TargetPosition).setValue(100);

    this.name = 'shutter - 33';
    this.position = 33;
    this.state = true;

    this.bus = bus;
    this.bus.on('new_current_position', (value) => {
      this.position = value;
      this.windowCoveringService.getCharacteristic(Characteristic.CurrentPosition).setValue(this.position);
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
      .on(CharacteristicEventTypes.SET, (value, callback) => {
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

// onCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
//   logger.info(`on.GET (${state})`);
//   callback(undefined, false);
// });
// onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
//   logger.info(`on.SET: ${value}`); state = value;
//   callback();
// });
// // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// let name = 'Roller Shutter - Front';
// nameCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
//   logger.info(`name.GET (${name})`);
//   callback(undefined, name);
// });
// nameCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
//   logger.info(`name.SET ${value}`); name = value;
//   callback();
// });
// // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// let position = 100;
// currentPositionCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
//   logger.info(`currentPosition.GET (${position})`);
//   callback(undefined, position);
// });
// currentPositionCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
//   logger.info(`currentPosition.SET (${value})`); position = value;
//   callback();
// });
// // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// let targetPosition = 100;
// targetPositionCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
//   logger.info(`targetPosition.GET (${targetPosition})`);
//   callback(undefined, targetPosition);
// });
// targetPositionCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
//   logger.info(`targetPosition.SET = ${value}`);

//   targetPosition = value;

//   try {
//     if (client) {
//       const payload = {
//         type: 'target_position',
//         value: targetPosition,
//       };
//       client.write(JSON.stringify(payload));
//     }
//   } catch {
//     // do nothing yet
//   }

//   callback();
// });
// // ----------------------------------------------------------------------------------------------------------------------------------------------------------------
