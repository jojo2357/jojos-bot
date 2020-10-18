const Discord = require('discord.js');

module.exports = {
  commands: 'invite',
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
      message.channel.send("To invite me to more servers, use this link: https://discord.com/api/oauth2/authorize?client_id=699366687455051808&permissions=10304&scope=bot");
  }
}