const { logger } = require('./logger');
const { Bus } = require('./bus');
const { Homekit } = require('./homekit');
const { Controller } = require('./controller');

logger.info('# starting the plugin');

const bus = new Bus();
const homekit = new Homekit(logger, bus);
const controller = new Controller(logger, bus);

function reconnect() {
  controller.initialize();
}

bus
  .on('new_target_position', (val) => {
    logger.info(`@event: New target position requested by the homekit app ${val}`);
  })
  .on('plugin_initialized', () => {
    logger.info('@event: Plugin initialized');
  })
  .on('plugin_published', () => {
    logger.info('@event: Plugin ready for use');
  })

  .on('controller_connected', () => {
    logger.info('@event: A connection with the controller has been established');
  })
  .on('new_current_position', (val) => {
    logger.info(`@event: New current position defined by the python controller ${val}`);
  })
  .on('controller_disconnected', () => {
    logger.info('@event: The controller disconnected');
    
    // Test if a reconnect once is sufficient to reconnect again, oh and giv the controller some time 
    setTimeout(reconnect, 10000);
  })
  .on('unsupported_message', (message) => {
    logger.info(`@event: Got an unsupported message from the controller ${message}`);
  })
  .on('unsupported_data', (data) => {
    logger.info(`@event: Got rubbish from the controller ${data}`);
  });

logger.info('# created the bus (and registered events we want to log) on which we publish events between the python controller and the homekit plugin');

// setup the homekit side
homekit.initialize();
homekit.publish();

// setup the controller side
controller.registerListeners();
controller.initialize();
