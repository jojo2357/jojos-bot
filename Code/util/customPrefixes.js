const fs = require('fs');
const { prefix } = require('../config.json');

module.exports = {
    prefixMap: new Map(),

    init(){
        fs.readdirSync(process.cwd() + '/assets/server-settings').forEach(file => {
            const settingsIn = require(process.cwd() + '/assets/server-settings/' + file);
            this.prefixMap.set(file.substring(0, file.indexOf('.')), settingsIn.prefix || prefix);
        })
        this.prefixMap.set('default', prefix);
    },

    updateMap(){
        fs.readdirSync(process.cwd() + '/assets/server-settings').forEach(file => {
            const settingsIn = require(process.cwd() + '/assets/server-settings/' + file);
            this.prefixMap.set(file.substring(0, file.indexOf('.')), settingsIn.prefix || prefix);
        })
    },

    get(guildID){
        return this.prefixMap.get(guildID) || prefix;
    }
}