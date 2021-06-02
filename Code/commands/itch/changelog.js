const fs = require("fs");
const {MessageEmbed} = require('discord.js');

module.exports = {
    commands: ['jabg-changelog', 'jabg-c'],
    maxArgs: 2,
    expectedArgs: "version channel",
    callback: (message, arguments) => {
        if (arguments.length === 0) {
            message.reply("Please specify a build (windows/mac) to get version-specific changelogs");
            let allVersions = [];
            fs.readdirSync('./assets/jabg').forEach((file) => {
                if (!allVersions.includes(file.replace('.log', '').split('_')[1]))
                    allVersions.push(file.replace('.log', '').split('_')[1]);
            });
            allVersions.sort((a = "", b = "") => {
                a = a.split('.');
                b = b.split('.');
                if (a[0] !== b[0])
                    return parseInt(a[0]) - parseInt(b[0]);
                if (a[1] !== b[1])
                    return parseInt(a[1]) - parseInt(b[1]);
                return a[2].localeCompare(b[2]);
            });
            message.channel.send(
                new MessageEmbed().setTitle("JABG changelogs").setDescription('```\n' + allVersions.join('\n') + '\n```')
            );
        } else if (arguments.length === 1) {
            if (fs.readdirSync('./assets/jabg').find((file) => file.split('_')[1].includes(arguments[0])))
                message.channel.send(fs.readFileSync(`./assets/jabg/` + fs.readdirSync('./assets/jabg').find((file) => file.split('.')[1].includes(arguments[0].substring(0, 3)))).toString());
            else
                message.reply("Could not find a changelog for version " + arguments[0]);
        } else {
            if (fs.existsSync(`./assets/jabg/changelog_${arguments[0]}_${arguments[1]}.log`))
                message.channel.send(fs.readFileSync(`./assets/jabg/changelog_${arguments[0]}_${arguments[1]}.log`).toString());
            else
                message.reply("Could not find a changelog for the " + arguments[1] + " version id " + arguments[0]);
        }
    }
};