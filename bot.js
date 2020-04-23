const Discord = require("discord.js")
const TokenFile = require("./auth.json")
var token = TokenFile.token
import GameClient from './gameclient'

const bot = new Discord.Client()
const gameclient = new GameClient()
var isPlaying = false
bot.login(token)

bot.on("message", msg => {
  if (msg.content.startsWith("Waiting for")) {
    msg.channel.send("Waiting for @ColasV...")
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