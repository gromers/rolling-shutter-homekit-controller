#!/bin/bash

# Stopping the controller and the homekit service
echo "stopping homekit"
sudo systemctl stop homekit

echo "stopping controller"
sudo systemctl stop controller

# Give the system 15 seconds to settle
echo "sleeping to allow for shutdown"
sleep 15

# Starting the controller
echo "starting the controller"
sudo systemctl start controller

# Sleeping 3 seconds to give the server startup time
echo "small delay .."
sleep 3

# Start the homekit service again
echo "starting homekit"
sudo systemctl start homekit

echo "current state:"
sudo systemctl status controller
sudo systemctl status homekit
