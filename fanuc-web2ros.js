var request = require('request')
const ROSLIB = require('roslib')
var topic
var lastStatus
var newStatus
var ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
})

ros.on('connection', function () {
  console.log('Connected to websocket server.')
  topic = new ROSLIB.Topic({

    ros: ros,
    name: '/joint_states',
    messageType: 'sensor_msgs/JointState'

  })
  setInterval(Forward, 100)
})

ros.on('error', function (error) {
  console.log('Error connecting to websocket server: ', error)
})

ros.on('close', function () {
  console.log('Connection to websocket server closed.')
})
function Forward () {
  request.get('http://192.168.1.100/karel/webmonitor', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      newStatus = JSON.parse(body)['joint']
     
      var message = new ROSLIB.Message({
        name: ['joint_1', 'joint_2', 'joint_3', 'joint_4', 'joint_5', 'joint_6'],
        position: [newStatus[0]/57.32,newStatus[1]/57.32,newStatus[2]/57.32-newStatus[1]/57.32,newStatus[3]/57.32,newStatus[4]/57.32,newStatus[5]/57.32]
      })
      if (!(lastStatus && newStatus.length === lastStatus.length &&
        newStatus.every(function (u, i) {
          return u === lastStatus[i]
        })
    )) {
        topic.publish(message)
        console.log('publishing:' + newStatus)
      }
      lastStatus = newStatus
    }
  })
}
