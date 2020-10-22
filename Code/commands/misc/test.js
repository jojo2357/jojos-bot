const Discord = require('discord.js');

module.exports = {
    commands: ['test'],
    minArgs: 0,
    callback: (message, arguments) => {
        if (message.author == '524411594009083933')
            message.reply(numberToBytecode(parseInt(arguments[0])))
    }
}

function numberToBytecode(num){
    var out = ""
    for (var i = 0; i < 8; i++){
        var thing = (num >> (8 * i)) & 0xFF
        out += String.fromCharCode(thing)
    }
    return out;
}