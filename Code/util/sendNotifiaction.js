const { spawn } = require('child_process');
const os = require('os');

module.exports = {
    sendNotification(args = ['']){
        if (os.platform().toString().toLowerCase().includes('win'))
            spawn(process.cwd() + '/sendNotification.bat' , args);
        else
            console.log("no window, no curtain (" + os.platform().toString() + ")");
    }
}