const Discord = require('discord.js');

module.exports = {
  commands: 'roles',
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const roles = new Discord.MessageEmbed()
      .setColor('#a200ff')
      .setTitle('Roles')
      .setDescription('These commands can give you free roles.')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Programmer Role', value: '-programmer' },
        { name: 'Gamer Role', value: '-gamer', inline: true },
        { name: 'Gets Pinged Role', value: '-gp', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(roles);
  }
}