const Discord = require("discord.js")
const TokenFile = require("./auth.json")
var token = TokenFile.token
const GameClient = require("./gameClient.js")

const bot = new Discord.Client()
var isPlaying
bot.login(token)

const https = require('https')
const http = require('http')
var io = require('socket.io-client')
var socket = io('http://localhost:8080')

const gameclient = new GameClient(socket)

const GetSetRequest = {
  //hostname: 'dcdl-backend.azurewebsites.net',
  hostname: 'localhost',
  port: 8080,
  path: '',
  method: 'GET',
  rejectUnauthorized: false
}

bot.on("message", msg => {
  if (msg.content.startsWith("Waiting for") && msg.content != "Waiting for ColasV...") {
    msg.channel.send("Waiting for ColasV...")
  }

  if (msg.content === "play") {
    msg.channel.send("New game started ! to respond, type r: and to stop the game, to end type stop.")
    isPlaying = true
    gameclient.NewGame(msg.channel)
  }

  if (isPlaying) 
  {
    if (msg.content === "stop") 
    {
      msg.channel.send("It's over now.")
      gameclient.GameOver(msg.channel)
      isPlaying = false
    }
    if (msg.content.startsWith("r:")) {
      gameclient.SendResponse(msg.channel.id, msg.author.id, msg.content.substring(2))
    }
  }
})

socket.on('dclc', function (message) {
  console.log("Message from DCLC : " + message)
})

socket.on('GameAvailable', function (setId, roomId) {
  if (isPlaying) {
    console.log("Game available !")
    var channel = bot.channels.cache.get(roomId)
    //socket.emit('message', "Ill take this game.");
    GetSetRequest.path = "/sets/" + setId
    //console.log("request sending to " + GetSetRequest.path)

    const req = http.request(GetSetRequest, res => {
      //console.log(`statusCode: ${res.statusCode}`)
      res.setEncoding('utf8');

      res.on('data', d => {
        {
          //console.log("THIS IS : " + d)
          let set = JSON.parse(d)
          if (set.mode === "numbers") {
            let question = set.question
            //console.log(question)
            let target = question.split(",")[0]
            let numbers = question.split(",")
            numbers.shift()
            channel.send("New set of numbers " + numbers.toString() + ". The target is " + target + " ! ")
          }
          else if (set.mode === "letters") {
            channel.send("New set of letters : " + set.question)
          }
          gameclient.RegisterCurrentSet(roomId,set.setId)
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

socket.on('GameOver', function (setId, roomId) {
  var channel = bot.channels.cache.get(roomId)
  GetSetRequest.path = "/sets/" + setId
  //console.log("request sending to " + GetSetRequest.path)

  const req = http.request(GetSetRequest, res => {
    //console.log(`statusCode: ${res.statusCode}`)
    res.setEncoding('utf8');
    var winners = []
    var score

    res.on('data', d => {
      {
        let set = JSON.parse(d)
        console.log(set)
        let players = set.playersInSet
        for (var player of players) {
          if (player.victory === true) {
            var playerName = bot.users.cache.get(player.playerId);
            winners.push(playerName)
            score = player.score
          }
        }
        if(winners.length>0)
        channel.send("Winners : " + winners.toString() + " with a score of " + score)
        else
        channel.send("No one wins this ! ")
      }
    })
  })

  req.on('error', error => {
    console.error("This is an error : " + error)
  })
  console.log(req.path)

  req.end()
})