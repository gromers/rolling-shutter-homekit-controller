#!/bin/bash

# -----------------------------------------------------------------------------
# This script is intended to run as a cron and should restart the whole pi if 
# the downtime of the controller / homekit service is higher than 3 minutes
# -----------------------------------------------------------------------------

controller_active=$(sudo systemctl is-active controller.service)
homekit_active=$(sudo systemctl is-active homekit.service)

if [ "$controller_active" != "active" ]
then
    sudo shutdown -r now
fi


if [ "$homekit_active" != "active" ]
then
    sudo shutdown -r now
fi