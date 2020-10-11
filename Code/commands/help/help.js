const Discord = require('discord.js');

module.exports = {
  commands: 'help',
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Commands')
      .setAuthor('Jojo2357\'s bot')
      .setDescription('All commands. Type in the chat the sections below with a \"=\" then with the description for more info about those commands.')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Connect-4', value: '=help-c4', inline: true },
        { name: 'Cypher', value: '=cypher', inline: true },
        { name: 'Music reccomendations', value: '=song', inline: true },
        { name: 'Dev notes', value: '=dev', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}