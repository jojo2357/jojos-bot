const Commando = require('discord.js-commando')
const client = new Commando.CommandoClient()
const config = require('../config.json');
const MusicDb = require('./music/music-manager.js');

client.on('message', message => {
    if (message.content === 'hi') {
        message.channel.send('Hello!');
    } else if (message.content === "gn") {
        message.channel.send('Good Night to you! 😴');
    } else if (message.content === "bitch") {
        message.channel.send('That\' not nice');
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
    } else if (message.content === "wanna play") {
        message.channel.send('Sure (haha annoying?)');
    } else if (message.content === "@everyone") {
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
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\n Server Invite Link: `);
    } else if (message.content === 'ping me') {
        message.reply(`You asked for it 🤯 ` + message.sender);
    } else if (message.content === "error") {
        message.channel.send('An error a day makes your brain go away!').then(messageReaction => {
            messageReaction.react("🤯")
        })
    } else if (message.content === "confusion") {
        message.channel.send('mad cuz bad').then(messageReaction => {
            messageReaction.react("🧠")
        })
    } else if (message.content === "ez") {
        message.channel.send('then let me challenge you. **WHAT IS 1+1**').then(messageReaction => {
            messageReaction.react("🤔")
        })
    } else if (message.content === "beg") {
        message.channel.send('Any thanks to spare? 🥺');
    } else if (message.content === "bruh") {
        message.channel.send('bruh urself');
    } else if (message.content === "bot info" || message.content === "info") {
        message.channel.send('**Owner:**  jojo\n**GitHub:** https://github.com/jojo2357/jojos-bot');
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
    } 
})

client.login(config.token); 