# fanuc-web2ros
A gateway between fanuc-webcontrol and ROS implemented as node.js module 

Fanuc-webcontrol:
https://github.com/ABC-iRobotics/fanuc-webcontrol/blob/master/API.md

There must be a running rosbridge server on ROS in orther to communicate
http://wiki.ros.org/rosbridge_suite

## Usage

### The module require 2 parameters:

-The IP and PORT of the rosbridge server(default: [localhost:9090])

-The IP of the karel server (default: [192.168.1.100])

`node fanuc-web2ros.js -rosbridge [ip+port] -karel [192.168.1.100]`



## What does it do?

The program checks the '.../karel/webmonitor.htm' url in every 100 milliseconds and reads the joint values from it.

If they change it publish them to the '/joint_states' topic of ROS.



# fanuc-ros2web
A gateway between ROS and fanuc-webcontrol implemented as node.js module 

Fanuc-webcontrol:
https://github.com/ABC-iRobotics/fanuc-webcontrol/blob/master/API.md

There must be a running rosbridge server on ROS in orther to communicate
http://wiki.ros.org/rosbridge_suite

## Usage

### The module require 2 parameters:

-The IP and PORT of the rosbridge server(default: [localhost:9090])

-The IP of the karel server (default: [192.168.1.100])

`node fanuc-ros2web.js -rosbridge [ip+port] -karel [192.168.1.100]`

## What does it do?

The program subscribe to the '/joint_states' topic of ROS, and when it changes it sends the states to the fanuc-webcontrol using a GET method.

## Script file
  node ./fanuc-web2ros.sh
  Launch both fanuc-web2ros and fanuc-ros2web on ip 192.168.1.101

