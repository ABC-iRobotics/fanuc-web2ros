#!/bin/bash

node fanuc-web2ros -karel 192.168.1.101
sleep 3
node fanuc-ros2web -karel 192.168.1.101

