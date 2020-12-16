const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['java-help', 'cmd', 'hacks'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        const help = new MessageEmbed()
            .setColor('#fff800')
            .setTitle('Java from command line help')
            .setDescription('Here are some common command line commands that are used in compiling and running java')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'javac *.java', value: 'Compiles all `.java` files in current directory at once', inline: true },
                { name: 'javac -cp C:/firstfolder/secondfolder/lastfolder/*.java', value: 'Compiles all `.java` files in `C:/firstfolder/secondfolder/lastfolder/` at once', inline: true },
                { name: 'javac FirstFile.java SecondFile.java ... LastFile.java', value: 'compiles only listed java files. may cause errors if some dependencies are excluded', inline: true },
                { name: 'java FirstFile', value: 'runs `main` in `FirstFile`', inline: true },
                { name: 'jar cvfme ConnectFourExecuteable.jar MANIFEST.MF MainClassName *.class', value: 'collects all .class files into one single jar file. See java -jar Jarfile.jar for MANIFEST.MF info', inline: true },
                { name: 'jar cvfme JarFileName.jar MANIFEST.MF MainClassName MainClass.class SecondClass.class ... LastClass.class', value: 'collects selected .class files into one single jar file. See java -jar Jarfile.jar for MANIFEST.MF info', inline: true },
                { name: 'java -jar Jarfile.jar', value: 'runs `main` in jar file denoted in `MANIFEST.MF` by the one line: `Main-Class: MainClass`', inline: true },
                { name: '\\` code \\`', value: 'in discord, will appear as ` code `\nonly use for single line code', inline: true },
                { name: '\\``` code \\```', value: 'in discord, will appear as ``` code ```\nonly use for multi line code', inline: true },
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}