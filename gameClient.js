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
    constructor( ) {
        this.socket = io.connect('https://localhost:8080')
    }
    NewGame(channel) {
        $('#poke').click(function () {
            socket.emit('message', 'Salut serveur, ça va ?');
        })

        socket.on('GameAvailable', function (message) {

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
            $('#poke').click(function () {
                socket.emit('message', "discord" + memberId, "");
            })
        }
    }

    GameOver(channel) {
    }

    SendResponse(msg) {
    }
}

module.exports = GameClient 
