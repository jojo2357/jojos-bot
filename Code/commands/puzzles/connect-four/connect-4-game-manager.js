const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');


module.exports = {
    commands: ['move'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        console.log("Plus one: " + (1 + parseInt(arguments[0])))
        if (0 > parseInt(arguments[0]) || parseInt(arguments[0]) > 6){
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
            if (Manager.usersGame('<@' + message.author + '>').isEmpty())
                message.channel.send("Brain is still loading, please be patient.");
            else{
                Manager.usersGame('<@' + message.author + '>').makeMove(arguments[0], 1);
                console.log(arguments);
            }
        else message.channel.send("either u dont know how to type numbers or something went wrong");
    }
}