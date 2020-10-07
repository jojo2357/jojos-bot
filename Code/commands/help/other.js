const Discord = require('discord.js');

module.exports = {
  commands: ['other', 'help other'],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments) => {
    const other = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Commands')
      .setAuthor('Shitbot, By PTZ')
      .setDescription('Weird and funny commands I added. There are secret commands the admin can see but you would have to find it yourself!')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'fun commands', value: '``-joke``', inline: true },
        { name: 'lol', value: '``-lol`` **under bug removal**', inline: true },
        { name: 'lmao', value: '``-lmao`` **under bug removal**', inline: true },
        { name: 'why no work', value: 'too bad, too sad', inline: true },
        { name: 'bye', value: 'cya', inline: true },
        { name: 'hi', value: 'hola', inline: true },
        { name: 'apple', value: 'an apple a day keeps\n the doctor away?', inline: true },
        { name: 'projects', value: 'a ton of projects', inline: true },
        { name: 'math test', value: 'haha', inline: true },
        { name: 'learn java', value: 'ew rude?', inline: true },
        { name: 'veggies bad', value: 'uh is it bad?', inline: true },
        { name: 'version', value: 'idk, test it out?', inline: true },
        { name: 'good bot', value: 'yep', inline: true },
        { name: 'nice bot', value: 'he will be glad', inline: true },
        { name: 'f', value: 'you\'ll see', inline: true },
        { name: 'avatar', value: 'your avatar', inline: true },
        { name: 'my info', value: 'your name and id', inline: true },
        { name: 'server info', value: 'server name and the amount of members.', inline: true },
        { name: 'ping me', value: 'pings you', inline: true },
        { name: 'gn', value: 'cya', inline: true },
        { name: 'server info', value: 'stuff about the server', inline: true },
        { name: 'my info', value: 'info about you', inline: true },
        { name: 'imo?', value: 'in my opinion', inline: true },
        { name: 'lmao?', value: 'try to guess', inline: true },
        { name: 'bot info', value: 'cya', inline: true },
        { name: 'bored', value: 'When life gives you boredomness, :LearntoCode:', inline: true },


      ).setTimestamp()
      .setFooter('**THERE ARE MORE SECRET COMMANDS, TRY TO FIND IT YOURSELF!**');
    message.channel.send(other);
  }
}