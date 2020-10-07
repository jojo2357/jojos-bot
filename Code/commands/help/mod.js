const Discord = require('discord.js');

module.exports = {
  commands: ['mod', 'moderation', 'help mod', 'help moderation'],
  minArgs: 0,
  maxArgs: 0,
  callback(message, arguments) {
    const mod = new Discord.MessageEmbed()
      .setColor('#2fff00')
      .setTitle('Moderation')
      .setDescription('There are only 2 commands for moderation currently, please wait for more to be released!')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Kick', value: '-kick \nUsed to kick someone from the server.' },
        { name: 'Ban', value: '-ban \nUsed to ban someone and other accounts with the same ip address.', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(mod);
  }
}