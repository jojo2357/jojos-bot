let cypherHard = ['An inflation a day makes your tires go KAWOOM!', 'When life gives you boredomness, :LearntoCode:', 'A XCode a day makes your knowledge go away', 'A XCode a day makes your life like cake', 'A accident a day makes me go away.', 'A hour a day makes time fly away.', 'An heart attack a day makes your mind go away.', 'A bruh a day makes your happiness go away.', 'An confusion a day makes your brain cells go away!', 'An error a day makes your brain go away!', 'Learning Java every day keeps your brain cells away.', 'A math test a unit makes you rage every day! 😉', 'An 🍎 a day keeps your money away.', 'A stomach ache makes your digestion system go cra cra.', 'A fart a day makes your nose go away.', 'A project a day makes your ideas go away', 'When life gives you free buffet, EAT UNTIL THEY BANRUPT to REGRET GIVING YOU FRREEEEEE.']
const Discord = require('discord.js');

module.exports = {
    commands: 'joke',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const ch = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle(cypherHard[Math.floor(Math.random() * cypherHard.length)])
        message.channel.send(ch);
    }
}