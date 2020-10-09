const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');


module.exports = {
    commands: ['move'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        if (!parseInt(arguments[0]) && arguments[0] != "0"){
            const ch = new Discord.MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('Am i looking at a moron?')
            .setDescription('learn to args my guy. a number 0-6 please')
            .setFooter('Sux to sux it seems')
            message.channel.send(ch);
        }
        else if (Manager.usersGame('<@' + message.author + '>') == null)
            message.channel.send('<@' + message.author + '> you dont have a game, silly! Use `=connect-4` to start one!')
        else if (Manager.usersGame('<@' + message.author + '>').channel != message.channel)
            message.channel.send("You have a game in progress in <#" + Manager.usersGame('<@' + message.author + '>').channel + ">")
        else if (Manager.usersGame('<@' + message.author + '>').hasRoom(parseInt(arguments[0])))
            Manager.usersGame('<@' + message.author + '>').makeMove(arguments[0], 1);
        else message.channel.send("either u dont know how to type numbers or something went wrong");
    }
}