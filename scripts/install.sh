#!/bin/bash

# -----------------------------------------------------------------------------
# This install script uses sub modules to prepare the system to act as control 
# unit for a rolling shutter. I spread this script out over multiple scripts
# for easier modification
# -----------------------------------------------------------------------------

# make all scripts that are necessary exectuable
sudo chmod +x ./restart.sh
sudo chmod +x ./uninstall.sh
sudo chmod +x ./update.sh
sudo chmod +x ./install_sub_scripts/packages.sh
sudo chmod +x ./install_sub_scripts/relocate_sources.sh
sudo chmod +x ./install_sub_scripts/create_services.sh

# installs the necessary packages (rpio, node and npm)
sh ./install_sub_scripts/packages.sh

# copies the checked out source to a specific location in the ~/
sh ./install_sub_scripts/relocate_sources.sh

# creates the services and enables them
sh ./install_sub_scripts/create_services.sh

# restarts all :)
sh ./restart.sh