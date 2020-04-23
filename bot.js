const Discord = require("discord.js")
const TokenFile = require("./auth.json")
var token = TokenFile.token
const GameClient = require("./gameClient.js")

const bot = new Discord.Client()
var isPlaying = false
bot.login(token)

const https = require('https')
const http = require('http')
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
      hostname: 'localhost',
      port: 8080,
      path: '/sets/' + message,
      method: 'GET',
      rejectUnauthorized:false
    }
    console.log("request sent to " + GetSetRequest.path)

    const req = http.request(GetSetRequest, res => {
      console.log(`statusCode: ${res.statusCode}`)
      res.setEncoding('utf8');
      
      res.on('data', d => {
        {
          //console.log("THIS IS : " + d)
          let response = JSON.parse(d)
          if (response.mode === "numbers") {
            let target = response.question.split(",")[0]
            let numbers = response.question.split(",").shift().toString()
            channel.send("New set of numbers " + numbers + ". The target is " + target + " ! ")
          }
          else if (response.mode === "letters") {
            channel.send("New set of letters : " + response.question)
          }
        }
      })
    })

    req.on('error', error => {
      console.error("This is an error : " + error)
    })
    console.log(req.path)

    req.end()

  }
})