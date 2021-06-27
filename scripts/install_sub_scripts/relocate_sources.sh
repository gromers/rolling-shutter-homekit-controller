#!/bin/bash

# This shell script is our small deploy script. It checks if the services need to be
# stopped, when all is stopped, we copy the latest version from the workspace into
# our execution directory. After that, we start the services again.

# 1. find out if we have a services directory. if not, create that directory
if [ -d "/home/pi/rolling-shutter-controller" ]
then
     echo "Directory /home/pi/rolling-shutter-controller exists."
  echo "Do you want to update the homekit plugin (y/n)?"
  read homekit_answer
  if [ "$homekit_answer" != "${homekit_answer#[Yy]}" ]
  then
    /bin/cp -rf /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/homekit-plugin/* /home/pi/rolling-shutter-controller/homekit
  fi
  echo "Do you want to update the controller (y/n)?"
  read controller_answer
  if [ "$controller_answer" != "${controller_answer#[Yy]}" ]
  then
    /bin/cp -rf /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/controller/*.py /home/pi/rolling-shutter-controller/controller
    /bin/cp -rf /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/controller/*.position /home/pi/rolling-shutter-controller/controller
  fi
else
     echo "Creating directory and copying first version."
  mkdir /home/pi/rolling-shutter-controller
  mkdir /home/pi/rolling-shutter-controller/controller
  mkdir /home/pi/rolling-shutter-controller/homekit

  cp /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/controller/*.py /home/pi/rolling-shutter-controller/controller
  cp /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/controller/*.position /home/pi/rolling-shutter-controller/controller
  cp /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/src/homekit-plugin/* /home/pi/rolling-shutter-controller/homekit
fi
