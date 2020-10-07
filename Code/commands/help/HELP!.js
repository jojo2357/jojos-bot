const Discord = require('discord.js');

module.exports = {
  commands: 'HELP!',
  minArgs: 0,
  maxArgs: 0,
  callback(message, arguments) {
    const emergency = new Discord.MessageEmbed().setColor('0xFF0000').setTitle("IF THIS IS EMERGENCY, LEAVE THE SERVER AND TELL SOMEONE YOU TRUST.").setDescription("This is only used for something big. For Ex: being cyberbullied, or bring hacked on your account. Please only use this at the help channel. If you confirm the things above, type [-HELP! CONFIRM]. If this is a accident, please delete your message ASAP. We may not get back to you within 48 hours.");
    message.author.send(emergency);
    message.reply('Please turn on direct messages! If it direct messages is allowed, the message will be sent to you once you click the bot\'s profile on the top left corner.');
  }
}