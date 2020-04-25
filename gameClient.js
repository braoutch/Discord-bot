const https = require('https')
const http = require('http')
// var io = require('socket.io-client')
var socket, bot
var currentSet = {}

class GameClient {
  constructor(pSocket) {
    socket = pSocket
  }
  NewGame(channel) {
    socket.emit("I want to play.")
    for (const [memberId, member] of channel.members) {
      socket.emit('playerconnection', memberId + ";1234;" + channel.id)
    }
  }

  GameOver(channel) {
    delete currentSet[channel.id]
    console.log("The room " + channel.id + " should now be disconnected.")
    socket.emit('gameover', channel.id)
  }

  SendResponse(roomId, playerId, response) {
    const data = JSON.stringify(
      {
        "setId": currentSet[roomId],
        "playerId": playerId,
        "response": response
      })

    console.log("Received response from " + playerId)

    const SendReponseRequest = {
      //hostname: 'dcdl-backend.azurewebsites.net',
      hostname: 'localhost',
      //port: 8080,
      path: '/actions',
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = https.request(SendReponseRequest, res => {
      console.log(`statusCode: ${res.statusCode}`)
      res.setEncoding('utf8');

      res.on('data', d => {
        {
          console.log(d)
        }
      })
    })

    req.on('error', error => {
      console.error(error)
    })

    req.write(data)
    req.end()
  }

  RegisterCurrentSet(roomId, setId) {
    currentSet[roomId] = setId
  }
}
module.exports = GameClient 
