const Discord = require('discord.js');

module.exports = {
  commands: ['help-sc', 'help-source-cypher'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#fff800')
      .setTitle('Cypher Help')
      .setAuthor('Idea, from Jojo2357')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Cypher decoding software', value: 'http://www.richkni.co.uk/php/crypta/letreplace.php', inline: true },
        { name: 'How to decode a cypher', value: 'https://www.dummies.com/games/cryptograms/cryptography-101-basic-solving-techniques-for-substitution-ciphers/', inline: true },
        { name: 'Cypher Encryption', value: 'https://github.com/jojo2357/Encryption-stuff', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}