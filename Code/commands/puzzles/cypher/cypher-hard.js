let cypherRaw = 'jojo\'s wacky cypher \n\n';
let plaintext = [];

const {readdirSync, readFileSync} = require("fs");
const { MessageEmbed } = require('discord.js');

let inited = false;

module.exports = {
    commands: ['cypher'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const ch = new MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle(cypherRaw)
            .setDescription(scramble(createCipher(), plaintext[Math.floor(Math.random() * plaintext.length)]))
            .setTimestamp()
            .setFooter('Haha, good luck!')
        message.channel.send(ch);
    }
}

function scramble(cipher = "zxcvbnmlkjhgfdsaqwertyuiop", text = "") {
    var out = "";
    for (var index = 0; index < text.length; index++) {
        if (text.charCodeAt(index) >= 97 && text.charCodeAt(index) <= 97 + 26)
            out += cipher.charAt(text.charCodeAt(index) - 97);
        else if (text.charCodeAt(index) >= 97 - 32 && text.charCodeAt(index) <= 97 + 26 - 32)
            out += cipher.charAt(text.charCodeAt(index) - 97 + 32);
        else
            out += text.charAt(index);
    }
    return out;
}

function createCipher() {
    if (!inited)
        readData();
    var cipher = "";
    while (cipher.length < 26) {
        var testVal = Math.floor(Math.random() * 26) + 97;
        if (!cipher.includes(String.fromCharCode(testVal)))
            cipher += String.fromCharCode(testVal);
    }
    return cipher;
}

function readData() {
    var files = readdirSync('assets/cipher-texts/');
    files.forEach(readAndAppend);
    inited = true;
}

function readAndAppend(file) {
    plaintext.push(readFileSync('assets/cipher-texts/' + file).toString());
}