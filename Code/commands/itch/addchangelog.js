const fs = require("fs");

module.exports = {
    commands: ['jabg-add-changelog', 'jabg-c-a'],
    minArgs: 3,
    expectedArgs: 'channel version changelog',
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        const paragraph = arguments.splice(2).join(' ');
        if (arguments[0] === "all"){
            fs.writeFileSync(`./assets/jabg/changelog_${arguments[1]}_win-64.log`, paragraph)
            fs.writeFileSync(`./assets/jabg/changelog_${arguments[1]}_mac.log`, paragraph)
        }else
            fs.writeFileSync(`./assets/jabg/changelog_${arguments[1]}_${arguments[0]}.log`, paragraph);
        fs.writeFileSync(`./assets/jabg/changelog_latest.log`, paragraph);
        message.reply("Noted.");
    }
}