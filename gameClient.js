// const https = require('https')
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
            hostname: 'localhost:8080',
            port: 443,
            path: '/actions',
            method: 'GET'
        }
    }
}
module.exports = GameClient 
