const Discord = require("discord.js")
const TokenFile = require("./auth.json")
var token = TokenFile.token


const bot = new Discord.Client()

bot.login(token)

bot.on("message", msg => {
  if (!msg.content.startsWith("Waiting for")) {
msg.channel.send("Waiting for @ColasV...")
 }
})

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel


  if(oldUserChannel === undefined && newUserChannel !== undefined) {

     // User Joins a voice channel
message.channel.send("Waiting for colavay...", {
 tts: true
})

  } else if(newUserChannel === undefined){

    // User leaves a voice channel

  }
})