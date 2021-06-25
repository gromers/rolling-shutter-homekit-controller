#!/bin/bash

sudo cp controller.service /etc/systemd/system/controller.service
sudo chmod 644 /etc/systemd/system/controller.service
sudo systemctl enable controller

sudo cp homekit.service /etc/systemd/system/homekit.service
sudo chmod 644 /etc/systemd/system/homekit.service
sudo systemctl enable homekit
