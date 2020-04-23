const https = require('https')
var io = require('socket.io-client')
const SendReponseRequest = {
    //hostname: 'dcdl-backend.azurewebsites.net',
    hostname: 'localhost:8080',
    port: 443,
    path: '/actions',
    method: 'GET'
}

class GameClient {
    constructor() {
        this.socket = io('http://localhost:8080')
        console.log("Socket object created.")
    }
    NewGame(channel) {
        this.socket.emit("I want to play.")

        this.socket.on('error', function (message) {
            console.log("Error : " + error)
        })

        this.socket.on('GameAvailable', function (message) {
            console.log("Game available !")
            this.socket.emit('message', "Ill take this game.");

            const GetSetRequest = {
                //hostname: 'dcdl-backend.azurewebsites.net',
                hostname: 'localhost:8080',
                port: 443,
                path: '/sets/' + message,
                method: 'GET'
            }

            const req = https.request(options, res => {
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
        })
        for (const [memberId, member] of channel.members) {
            this.socket.emit('message', "discord" + memberId, "");
        }
    }

    GameOver(channel) {
    }

    SendResponse(msg) {
    }
}

module.exports = GameClient 
