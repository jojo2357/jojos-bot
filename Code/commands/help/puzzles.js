const Discord = require('discord.js');

module.exports = {
  commands: ['help-puzzles', 'puzzles'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Commands')
      .setAuthor('Shitbot, By PTZ')
      .setDescription('All commands for shitbot, type in the chat the sections below with a \"=\" then with the description for more info about those commands.')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Cypher, Bytes, Tap Code', value: '-help-fun', inline: true },
        { name: 'Cypher Help Links', value: '-help-sc', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}