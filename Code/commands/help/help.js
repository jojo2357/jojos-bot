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
        { name: 'Games', value: '-games', inline: true },
        { name: 'Miscellaneous', value: '-other', inline: true },
        { name: 'Puzzles', value: '-puzzles', inline: true },
        { name: 'Secret Commands for mods!', value: '-sc', inline: true },

      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}