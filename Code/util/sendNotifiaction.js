const { spawn } = require('child_process');
const os = require('os');
const remoteConsole = require('./remoteConsole.js');

module.exports = {
    sendNotification(args = ['']){
        if (os.platform().toString().toLowerCase().includes('win'))
            spawn(process.cwd() + '/sendNotification.bat' , args);
        else
            remoteConsole.addRecentData(args.join(' '));
    }
}