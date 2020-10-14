const Discord = require('discord.js');

module.exports = {
  commands: ['help-c4', 'help-connect-4', 'connect-4-help'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const help = new Discord.MessageEmbed()
      .setColor('#fff800')
      .setTitle('Connect 4 Help')
      .setDescription('um, really hope you know how to play. https://en.wikipedia.org/wiki/Connect_Four ig :shrug:\
      \nNote that the far left column is 0, the middle is 3 and the far right is 6\
      \nIf the bot is playing `thinking about connect-4`, then the brain is still loading. `=connect-4` means that the brain is finished loading'
      )
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Start a solo game', value: '=connect-4', inline: true },
        { name: 'Challenge a friend', value: '=connect-4 @urFrend', inline: true },
        { name: 'Accept only challenge', value: '=accept', inline: true },
        { name: 'Accept one of many challenges', value: '=accept @challenger', inline: true },
        { name: 'Make a move', value: '=move column #', inline: true },
        { name: 'Show your game', value: '=show', inline: true },
        { name: 'Quit your game', value: '=ff', inline: true },
        { name: 'List games', value: '=show-all', inline: true },
        { name: 'Show lifetime stats', value: '=connect-4-stats (optional)UserId/Mention', inline: true },
      ).setTimestamp()
      .setFooter('More commands comming soon!');
    message.channel.send(help);
  }
}