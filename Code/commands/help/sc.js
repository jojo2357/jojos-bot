const Discord = require('discord.js');

module.exports = {
    commands: ['sc', 'secretCommands'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        if (message.member.roles.cache.some(r => r.name === "Moderator")) {

            const sc = new Discord.MessageEmbed()

                .setColor('#ff4ad7')
                .setTitle('Secret Commands')
                .setDescription('Hi Admins, here are the secret commands 😃.')
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'bitch', value: 'That\'s not nice' },
                    { name: 'fuck', value: 'What\'s wrong?', inline: true },
                    { name: 'shitbot', value: 'I AM WATCHING YOU! 😠', inline: true },
                    { name: 'i am 12', value: 'ban hammer', inline: true },
                    { name: 'warn', value: 'Really wants to be \nwarned?', inline: true },
                    { name: 'flick u', value: 'What will it say?', inline: true },
                    { name: '@everyone', value: 'ew', inline: true },
                    { name: '@here', value: 'I\'m always here but \nI DON\' WANT TO BE \nPINNED!', inline: true },
                    { name: 'f in math', value: 'MATH TEST! awwww man', inline: true },
                    { name: 'shut up ', value: 'Haha muted', inline: true }

                ).setTimestamp()
                .setFooter('More commands comming soon!');
            message.channel.send(sc);
        } else {
            message.channel.send('No cheating allowed. 😜')
        }
    }
}