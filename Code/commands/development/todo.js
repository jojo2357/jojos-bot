const Discord = require('discord.js');

module.exports = {
  commands: ['TODO', 'todo', 'changelog'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#fff800')
      .setTitle('Things to do:')
      .setDescription('Add multiplayer connect-4\nMaybe create connect-4 tournaments\nAdd more songs (I only looked at 4 bands)\nConnect LOL api\nenable making moves via reaction instead of =move')
      .setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}