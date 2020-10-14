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
        { name: 'Connect-4', value: '=connect-4-help', inline: true },
        { name: 'Cypher', value: '=cypher', inline: true },
        { name: 'Music Recommendations', value: '=song', inline: true },
        { name: 'Dev Notes', value: '=dev', inline: true },
        { name: 'Java Tips', value: '=java-help', inline: true },
        { name: 'Make a suggestion', value: '=suggest', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}