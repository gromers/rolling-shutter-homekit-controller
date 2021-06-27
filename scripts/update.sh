#!/bin/bash

# -----------------------------------------------------------------------------
# copies the current source over the old source and then restarts the services
# -----------------------------------------------------------------------------

# TODO: checkout sources

# stopping the services (first the client then the server)
sudo systemctl stop homekit
sudo systemctl stop controller

# sleep to make sure sources are free
sleep 15

# copies the checked out source to a specific location in the ~/
/bin/cp -rf /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/homekit-plugin/* /home/pi/rolling-shutter-controller/homekit
/bin/cp -rf /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/controller/*.py /home/pi/rolling-shutter-controller/controller

# make sure npm packages are up to date 
cwd=$(pwd)
cd /home/pi/rolling-shutter-controller/homekit
sudo npm install
cd $cdw

# restarts all :)
sh ./restart.sh