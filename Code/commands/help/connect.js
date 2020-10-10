const Discord = require('discord.js');

module.exports = {
  commands: ['help-c4', 'help-connect-4'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#fff800')
      .setTitle('Cypher Help')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Start a solo game', value: '=connect-4', inline: true },
        { name: 'Make a move', value: '=move <column #>', inline: true },
        { name: 'Show your game', value: '=show', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}