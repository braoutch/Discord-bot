const Discord = require("discord.js")
const TokenFile = require("./auth.json")
var token = TokenFile.token
const GameClient = require("./gameClient.js")

const bot = new Discord.Client()
var isPlaying = false
bot.login(token)

const https = require('https')
var io = require('socket.io-client')
var socket = io('http://localhost:8080')

const gameclient = new GameClient(socket)

bot.on("message", msg => {
  if (msg.content.startsWith("Waiting for") && msg.content != "Waiting for ColasV...") {
    msg.channel.send("Waiting for ColasV...")
  }

  if (msg.content === "play") {
    msg.channel.send("New game started ! to respond, type r: and to stop the game, end type gameover.")
    isPlaying = true
    gameclient.NewGame(msg.channel)
  }

  if (isPlaying) {
    if (msg.content === "gameover") {
      msg.channel.send("New game started ! to respond, type r: and to stop the game, end type gameover.")
      gameclient.GameOver(msg.channel)
    }
    if (msg.content.startsWith("r:")) {
      gameclient.SendResponse(msg)
    }

  }
})

socket.on('dclc', function (message) {
  console.log("Message from DCLC : " + message)
})

socket.on('GameAvailable', function (message) {
  if (isPlaying) {
    console.log("Game available !")
    //socket.emit('message', "Ill take this game.");

    const GetSetRequest = {
      //hostname: 'dcdl-backend.azurewebsites.net',
      hostname: 'localhost:8080',
      port: 443,
      path: '/sets/' + message,
      method: 'GET'
    }

    const req = https.request(GetSetRequest, res => {
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
})