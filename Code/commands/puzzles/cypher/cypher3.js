const Discord = require('discord.js');

module.exports = {
    commands: ['cypher003', 'c3'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha3 = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('In my opinion, I think that Java is the easier programming language out there. If you think that\'s hard, wait until you try C++ and Swift lol. My first programming language was C++ and even though it\'s challenging, it is really fast for my 300 dollar computer. (Well, if it\'s not then I don\'t think people would use it :wink:.')
        .setTimestamp()
        message.channel.send(cha3);
    }
}