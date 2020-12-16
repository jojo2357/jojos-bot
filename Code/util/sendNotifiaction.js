const { spawn } = require('child_process');
const { platform } = require('os');
const remoteConsole = require('./remoteConsole.js');

module.exports = {
    sendNotification(args = ['']) {
        if (platform().toString().toLowerCase().includes('win'))
            spawn(process.cwd() + '/sendNotification.bat', args);
        else
            remoteConsole.addRecentData(args.join(' '));
    }
}