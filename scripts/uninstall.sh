#!/bin/bash

# -----------------------------------------------------------------------------
# Due to all my debugging attempts, I noticed a uninstall would come in handy 
# (and it also let me test the install script)
# -----------------------------------------------------------------------------

# Remove auto restart job
crontab -u pi -l | grep -v '/usr/bin/bash /home/pi/rolling-shutter-controller/auto_restart.sh'  | crontab -u pi -


# Stopping the services (first the client then the server)
sudo systemctl stop homekit
sudo systemctl stop controller

# Disabling the services 
sudo systemctl disable homekit
sudo systemctl disable controller

# removing the services 
sudo rm /etc/systemd/system/homekit.service
sudo rm /etc/systemd/system/controller.service

# removing the dump from the users root 
sudo rm -rf /home/pi/rolling-shutter-controller

# removing the installed packages
#sudo apt-get remove nodejs
#sudo apt-get remove npm
sudo apt-get remove rpi.gpio
