const Discord = require('discord.js');

module.exports = {
  commands: ['TODO', 'todo', 'changelog'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#fff800')
      .setTitle('Things to do:')
      .setDescription(
        'Maybe create connect-4 tournaments\
        \nAdd more songs (I only looked at 4 bands)\
        \nMake a bot version that only learns from the community (rn, it teaches itself by playing a rng)'
        )
      .setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}