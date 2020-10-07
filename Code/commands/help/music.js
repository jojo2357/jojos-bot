const Discord = require('discord.js');

module.exports = {
  commands: ['music', 'help music'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, args) => {
    const music = new Discord.MessageEmbed()
      .setColor('#ff7600')
      .setTitle('Music')
      .setDescription('More music commands will be added slowly over time.')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'join', value: '-join' },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(music);
  }
}