let cypherHard = ['Cypher 003\n\nIz ym bcizibz, I guizw guag Vaja if gur rafire cebteayyizt xazthatr bhg gurer. Is mbh guizw guag\'f uaeq, kaig hzgix mbh gem P++ azq Fkisg xbx. Ym siefg cebteayyizt xazthatr kaf P++ azq rjrz gubhtu ig\'f puaxxrztizt, ig if eraxxm safg sbe ym 300 qbxxae pbychgre. (Krxx, is ig\'f zbg gurz I qbz\'g guizw crbcxr kbhxq hfr ig :kizw:.', 'Cypher 004:\n\nOw hwd qino ic epzh lsavvpnrinr cw oplwop cspbp lhxspzb? Fpvv cspzp azp manh fpkbicpb ano bwdzlpb csac mah spvx hwd in csib twdznph! Chxp "-spvx bwdzlpb lhxspz" wz "-spvx bl" cw rpc bwmp fpkbicpb csac mirsc tdbc spvx hwd a vwc ! Cspzp azp wcspz oplwoinr rampb hwd lan xvah viup khcpb ano mwzp! Avbw, csp anbfpzb qwz lhxspzb lan kp qwdno kh "-l<lhxspz ndmkpz>". Qwz pgamxvp, csib ib lhxspz 4, fsils mpanb hwd lan chxp "l4" cw bpp csp anbfpzb!']
const Discord = require('discord.js');

module.exports = {
    commands: ['cypher-easy', 'ce'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const ch = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle(cypherHard[Math.floor(Math.random() * cypherHard.length)])
        .setTimestamp()
        .setFooter('Haha, good luck!')
        message.channel.send(ch);
    }
}