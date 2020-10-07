const Commando = require('discord.js-commando')
const client = new Commando.CommandoClient()
const config = require('../config.json');


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
    } else if (message.content === "i am 12") {
        message.channel.send('Banned! 🔨');
    } else if (message.content === "bye") {
        message.channel.send('Cya! 👋🏼');
    } else if (message.content === "warn") {
        message.channel.send('Do you want to be warned?');
    } else if (message.content === "apple") {
        message.channel.send('An 🍎 a day keeps your money away. (LMAO, I still like apple products, don\'t ban me)');
    } else if (message.content === "projects") {
        message.channel.send('Currently working on many projects so STOP ASKING.');
    } else if (message.content === "flick u") {
        message.channel.send('...');
    } else if (message.content === "math test") {
        message.channel.send('A math test a unit makes you rage every day! 😉');
    } else if (message.content === "learn java") {
        message.channel.send('Learning Java every day keeps your brain cells away. (Okay that was a joke, but still do it and lose some brain cells)');
    } else if (message.content === "wanna play") {
        message.channel.send('Sure (haha annoying?)');
    } else if (message.content === "veggies bad") {
        message.channel.send('Eat your veggies kids!').then(messageReaction => {
            messageReaction.react("🤮");
        });
    } else if (message.content === "@everyone") {
        message.channel.send('You didn\'t expect that to work did you?').then(messageReaction => {
            messageReaction.react("😡");
        });
    } else if (message.content === "@here") {
        message.channel.send('Pings these days...').then(messageReaction => {
            messageReaction.react("😡");
        });
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
        message.reply(`You asked for it 🤯`);
    } else if (message.content === 'f in math') {
        message.channel.send('Oofies, no big deal, all you need to do, STOP IT GET, SOME HELP, and study more.');
    } else if (message.content === 'imo?') {
        message.channel.send('in my opinion');
    } else if (message.content === 'lmao?') {
        message.channel.send('laugh my ass oof (not really oof, it\'s off)');
    } else if (message.content === "shut up") {
        message.channel.send('Okay, you will be muted rn.');
    } else if (message.content === "error") {
        message.channel.send('An error a day makes your brain go away!').then(messageReaction => {
            messageReaction.react("🤯")
        })
    } else if (message.content === "confusion") {
        message.channel.send('An confusion a day makes your brain cells go away!').then(messageReaction => {
            messageReaction.react("🧠")
        })
    } else if (message.content === "ez") {
        message.channel.send('then let me challenge you. **WHAT IS 1+1**').then(messageReaction => {
            messageReaction.react("🤔")
        })
    } else if (message.content === "beg") {
        message.channel.send('Any thanks to spare? 🥺');
    } else if (message.content === "bruh") {
        message.channel.send('A bruh a day makes your happiness go away.');
    } else if (message.content === "heart attack") {
        message.channel.send('An heart attack a day makes your mind go away.');
    } else if (message.content === "wasting time") {
        message.channel.send('A hour a day makes time fly away.');
    } else if (message.content === "accident") {
        message.channel.send('A accident a day makes me go away.');
    } else if (message.content === "bot info") {
        message.channel.send('**Owner:**  PTZ\n**GitHub:** https://github.com/PTZ8/Discord-Bot-JavaScript');
    } else if (message.content === "creeper") {
        message.channel.send('AWW man!');
    } else if (message.content === "how to code") {
        message.channel.send('by typing words into your pc');
    } else if (message.content === "how to math") {
        message.channel.send('calculator');
    } else if (message.content === "too bad") {
        message.channel.send('too sad');
    } else if (message.content === "bored") {
        message.channel.send('When life gives you boredomness, :LearntoCode:');
    }
})

client.login(config.token); 