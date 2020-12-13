const { spawn } = require('child_process');

module.exports = {
    sendNotification(args = ['']){
        if (navigator.platform.toLowerCase().includes('window'))
            spawn('../sendNotification.bat' , args);
        else
            console.log("no window, no curtain");
    }
}