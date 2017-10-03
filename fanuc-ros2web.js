var request = require('request')
const ROSLIB = require('roslib')
var lastCommand
var karel = '192.168.1.100'
var rosbridge = 'localhost:9090'
if (process.argv.indexOf('-rosbridge') !== -1 && process.argv[process.argv.indexOf('-rosbridge') + 1]) {
  rosbridge = process.argv[process.argv.indexOf('-rosbridge') + 1]
}
if (process.argv.indexOf('-karel') !== -1 && process.argv[process.argv.indexOf('-karel') + 1]) {
  karel = process.argv[process.argv.indexOf('-karel') + 1]
}
var ros = new ROSLIB.Ros({
  url: 'ws://' + rosbridge
})

ros.on('connection', function () {
  console.log('Connected to websocket server.')

  request.get({ url: 'http://' + karel +
    '/KAREL/webstart?str_task=webmotion'
  }, function optionalCallback (err, httpResponse, body) {
    if (err) {
      return console.error('Error starting webmotion', err)
    } else {
      console.log('Webmotion application started! ')
    }
  })
  var listener = new ROSLIB.Topic({
    ros: ros,
    name: '/joint_states',
    messageType: 'sensor_msgs/JointState'
  })
  listener.subscribe(function (message) {
    if (!ArrayEqual(lastCommand, message.position)) {
      request.get({ url: 'http://' + karel +
      '/KAREL/webcontrol?str_mtn_mod=1&str_coord1=' + message.position[0] * 57.32 +
      '&str_coord2=' + message.position[1] * 57.32 +
      '&str_coord3=' + (message.position[2] * 57.32 + message.position[1] * 57.32) +
      '&str_coord4=' + message.position[3] * 57.32 +
      '&str_coord5=' + message.position[4] * 57.32 +
      '&str_coord6=' + message.position[5] * 57.32
      }, function optionalCallback (err, httpResponse, body) {
        if (err) {
          return console.error('Error sending joint state values', err)
        }
        console.log('Joint state values sent succesfully:')
        console.log(message.position)
      })
    }
    lastCommand = message.position
  })
})

ros.on('error', function (error) {
  console.log('Error connecting to websocket server: ', error)
})

ros.on('close', function () {
  console.log('Connection to websocket server closed.')
})

function ArrayEqual (array1, array2) {
  return ((array1 && array2 && array1.length === array2.length &&
    array1.every(function (u, i) {
      return u === array2[i]
    })
))
}
