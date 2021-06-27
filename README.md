# Rolling shutter controller
This tiny app lets an iOS user control a relay board. To achieve this, it has a python part that uses the rpi.gpio library to control the GPIO of a RaspberryPI and NodeJS part that handles interfacing with the Homekit app. 

## To install
There are a few prerequisites one that should be done first:
1. make sure node & npm are installed
1. make sure python is installed
1. for out-of-the-box PIs I recommend you do an ```crontab -e``` first. That creates a crontab file for the user who executes it.
1. checkout the source at /home/pi/Desktop/workspace
1. navigate to /home/pi/Desktop/workspace/rolling-shutter-homekit-controller/scripts
1. give the installation file executing permissions (the +x part) ```chmod +x install.sh```
1. execute the install script with sudo rights (which the pi user usually already has)

## Running the server on Mac
Completely possible if you have node+npm and python installed. However, the rpi.gpio library is not available on Mac, so if you like to debug:
1. checkout all the source;  
1. update the relay.py file:  
    - comment out the import of the library in relay  
    - comment out the GPIO calls  
1. start the python backend with ```python app.py```
1. install the packages with ```npm install```
1. start the node client ```npm start```

## Outstanding issues:
There are two outstanding issues as far as I know, but I don't have found the time yet to resolve those. 
1. Add node installation to install script
1. When the pipe between Node and Python gets broken during an adjustment, the adjustment fails, and since the position is stored after the adjustment, the position is off.
