const fs = require('fs');

module.exports = {
    commands: 'rc',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        if (message.author.id != '524411594009083933')
            return;
        var stuff = require('../../config.json');
        stuff.remoteConsole = !stuff.remoteConsole;
        message.reply('Remote console is now ' + (stuff.remoteConsole ? 'enabled' : 'disabled'));
        fs.writeFileSync(process.cwd() + '/config.json', JSON.stringify(stuff));
    }
}