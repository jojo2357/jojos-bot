const Discord = require('discord.js');

module.exports = {
    commands: ['win-hax'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const help = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Ways to make windows experience better')
        .setDescription('Windows is kinda trash ngl. They force shit down ur throat and make you sob with Microsoft Edge. Here are some tricks that may make your windows experience less bad\nFeel free to use `=suggest` to suggest a new tip/trick!')
        .addFields(
          { name: 'Multiple desktops, one monitor', value: '- Start off by doing `win`+`tab`. You did it right when all the windows end up in a list sort of like `alt`+`tab` but u can see ur desktop\n- Select `new desktop` at the top left (you can drag and drop windows to switch desktops from this screen)\n- You can navigate between desktops by clicking it at the top, or use `win`+`ctrl`+`left/right arrow-key`'},
          { name: 'Disable `f1` help menu on keyboards that have it', value: 'Put the following into a new text file:\n```taskkill /f /im HelpPane.exe\
          \ntakeown /f c:\\windows\\HelpPane.exe\
          \nicacls c:\\windows\\HelpPane.exe /deny Everyone:(X)```\n- Name it anything and change the file extention to `.cmd`\n- Right click the file and select `Run as administrator`'},
        )
        .setFooter('More lifehacks coming soon!');
      message.channel.send(help);
    }
}