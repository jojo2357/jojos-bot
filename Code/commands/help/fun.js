const Discord = require('discord.js');

module.exports = {
  commands: ['help-fun'],
  minArgs: 0,
  maxArgs: 0,
  callback(message, arguments) {
    const mod = new Discord.MessageEmbed()
      .setColor('#2fff00')
      .setTitle('Moderation')
      .setDescription('Some hard and ez games for you, and your friends to play.')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Cypher Hard or cypher easy', value: '-ch, -ce\nWant to try hor hard cyphers are? Well this is the one, but don\'t get too excited. It\'s super harderito.' },
        { name: 'Cypher <cypher number>', value: '-c1, -c2, ect. \nWanna check if your answers to these cypher are correct? Go ahead, you can cheat.', inline: true },
        { name: 'Bytes Easy', value: '-be' },
        { name: 'Bytes <bytes number>', value: '-b1, -b2, ect. \nWanna check if your answers to these bytes are correct? Go ahead, you can cheat.', inline: true },
        { name: 'Tap Code', value: '-tc' },
        { name: 'Tap Code <tap code number>', value: '-tc1, -tc2, ect. \nWanna check if your answers to these bytes are correct? Go ahead, you can cheat.', inline: true },

      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(mod);
  }
}