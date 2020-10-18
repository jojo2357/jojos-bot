const Commando = require('discord.js-commando')
const client = new Commando.CommandoClient()
const config = require('../config.json');
const MusicDb = require('./music/music-manager.js');
const Manager = require('./puzzles/connect-four/game/connect-4-game-holder.js');

client.on('message', message => {
    if (message.author.bot) 
        return;
    if (message.toString().length == 1 && message.toString().substr(0,1) <= '7' && message.toString().substr(0,1) >= '1'){
        var huh = Manager.usersGame('<@' + message.author.id + '>')
        if (Manager.usersGame('<@' + message.author.id + '>') != null && Manager.usersGame('<@' + message.author.id + '>').channel[Manager.usersGame('<@' + message.author.id + '>').players.indexOf('<@' + message.author.id + '>')].id == message.channel.id && Manager.usersGame('<@' + message.author.id + '>').hasRoom(message.toString().substr(0,1) - 1)) {
            if (Manager.usersGame('<@' + message.author + '>').turn == 1 + Manager.usersGame('<@' + message.author + '>').players.indexOf('<@' + message.author + '>')) {
                Manager.usersGame('<@' + message.author + '>').makeMove(message.toString().substr(0,1) - 1, 1 + Manager.usersGame('<@' + message.author + '>').players.indexOf('<@' + message.author + '>'));
                message.delete();
                return;
            }
        }
    }
    if (message.content === "Hello!") {
        message.channel.send('hi');
    } else if (message.content === "gn") {
        message.channel.send('Good Night to you my homies :kissing_heart:');
    } else if (message.content === "bitch") {
        message.channel.send('That\'s not nice');
    } else if (message.content === "fuck") {
        message.channel.send('What\'s wrong?');
    } else if (message.content === "shitbot") {
        message.channel.send('I AM WATCHING YOU! 😠');
    } else if (message.content === "why it no work") {
        message.channel.send('because you do not know how to code...');
    } else if (message.content === "bye") {
        message.channel.send('Cya! 👋🏼');
    } else if (message.content === "flick u") {
        message.channel.send('(╯°□°）╯︵ ┻━┻');
    /*} else if (message.content.includes('among us')) {
        message.channel.send('Such a 1-d game, doesn\'t challenge the mind, can learn every aspect of the game from memes, and overall a shit game whose only benefit is that it facilitates enjoyable interactions with friends');
    */} else if (message.content === "@everyone") {
        message.channel.send('Y u gotta @ me like that?');
    } else if (message.content === "@here") {
        message.channel.send('Y u gotta @ me like that?');
    } else if (message.content === "nice bot") {
        message.channel.send('☺️');
    } else if (message.content === "good bot") {
        message.channel.send('☺️ thx');
    } else if (message.content === "f") {
        message.channel.send('☠️');
    } else if (message.content === "porn") {
        message.channel.send('nope');
    } else if (message.content === "avatar") {
        message.channel.send(message.author.displayAvatarURL());
    } else if (message.content === 'my info') {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    } else if (message.content === 'server info') {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    } else if (message.content === "confusion") {
        message.channel.send('mad cuz bad').then(messageReaction => {
            messageReaction.react("🧠")
        })
    } else if (message.content === "ez") {
        message.channel.send('then let me challenge you. **WHAT IS 1+1**').then(messageReaction => {
            messageReaction.react("🤔")
        })
    } else if (message.content === "bruh") {
        message.channel.send('bruh urself');
    } else if (message.content === "bot info" || message.content === "info") {
        message.channel.send('**Owner:**  jojo2357#1417\n**GitHub:** https://github.com/jojo2357/jojos-bot');
    } else if (message.content === "creeper") {
        message.channel.send('ohhh nononono');
    } else if (message.content === "how to code") {
        message.channel.send('by typing words into your pc');
    } else if (message.content === "how to math") {
        message.channel.send('calculator and desmos');
    } else if (message.content === "too bad") {
        message.channel.send('too sad');
    } else if (message.content === "bored") {
        message.channel.send('When life gives you boredom, make boredomade');
    } else if (message.content === "uwu") {
        message.channel.send('owo');
    } else if (message.content === "random song") {
        message.channel.send('!p ' + MusicDb.getRandomName());
    } else if ((message.content.includes("pm"))) {
        message.channel.send('Have you considered using 24-hour time? It drastically reduces redundencies');
    }
})

client.login(config.token); 