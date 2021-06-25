#!/bin/bash

# Stopping the controller and the homekit service
sudo systemctl stop homekit
sudo systemctl stop controller

# Give the system 15 seconds to settle
sleep 15

# Starting the controller
sudo systemctl start controller

# Sleeping 3 seconds to give the server startup time
sleep 3

# Start the homekit service again
sudo systemctl start homekit
