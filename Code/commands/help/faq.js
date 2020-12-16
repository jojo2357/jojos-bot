const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['q+a', 'faq'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        const help = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('FAQ \\ Q+A')
            .setAuthor('Jojo2357\'s bot')
            .setDescription('')
            .addFields(
                { name: 'My game disappeared!', value: '=show or the bot restarted and the data is lost :sob:' },
                { name: 'What is a connect-4 brain?', value: 'Basically everything that the computer learned playing x amount of practice games that gets saved to a file so that the computer doesnt have to relearn connect-4 when the bot turns on' },
                { name: 'What do the numbers with a brain even mean?', value: 'The number is the number of practice games that the bot played. 10K = ten thousand' },
                { name: 'What is a community brain?', value: 'It is a connect four brain that has been trained solely by you, the community. Unlike the other brains which have been trained by playing a random number generator, this brain has played all sorts of strategies. ' },
                { name: 'What is the end goal?', value: 'I want to see how well the computer can become. What I have found is that the brains conditioned by random number generation are only good against humans that play like random number generators (ie. little strategy). Will this brain end up becoming the perfect brain? I do not know but i sure hope so :upside_down:' },
            ).setTimestamp()
            .setFooter('Have a question? Use =suggest to message me it');
        message.channel.send(help);
    }
}