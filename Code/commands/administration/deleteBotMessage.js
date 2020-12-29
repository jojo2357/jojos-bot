module.exports = {
    commands: ['delete-message', 'del'],
    minArgs: 0,
    callback: (message, arguments) => {
        if (message.guild && message.author.id != message.guild.owner.id && message.author.id != '524411594009083933')
            return;
        message.channel.messages.fetch(arguments[0]).then(msg => msg.author == '789368852936917002' || msg.author == '699366687455051808' ? msg.delete() : message.reply("Cannot delete that since I didnt send it").delete({timeout: 10000})).catch(err => message.reply("An error has occured. (the message has to be in this channel)"));
        message.guild && message.delete();
    }
}