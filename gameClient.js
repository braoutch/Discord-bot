const https = require('https')
const http = require('http')
// var io = require('socket.io-client')
var socket

class GameClient {
constructor(s){
socket = s
}
    NewGame(channel) {
        socket.emit("I want to play.")
        for (const [memberId, member] of channel.members) {
            socket.emit('message', "discord" + memberId + ";1234;" + channel.id)
        }
    }

    GameOver(channel) {
    }

    SendResponse(msg) {
        const SendReponseRequest = {
            //hostname: 'dcdl-backend.azurewebsites.net',
            hostname: 'localhost',
            port: 8080,
            path: '/actions',
            method: 'POST'
        }


        const req = https.request(SendReponseRequest, res => {
            console.log(`statusCode: ${res.statusCode}`)
      
            res.on('data', d => {
              {
                console.log(d)
      
                if (d.mode === "numbers") {
                  let target = d.question.split(",")[0]
                  let numbers = d.question.split(",").shift().toString()
                  channel.send("New set of numbers " + numbers + ". The target is " + target + " ! ")
                }
                else if (d.mode === "letters") {
                  channel.send("New set of letters : " + d.question)
                }
              }
            })
          })
      
          req.on('error', error => {
            console.error(error)
          })
      
          req.end()
    }
}
module.exports = GameClient 
