const { readFileSync, writeFileSync} = require('fs');

module.exports = {
    bruhListed: [''],

    loadbruhList() {
        this.bruhListed = [];
        this.bruhListed = readFileSync('assets/blacklist/blacklist.dat').toString().split('\r\n');
        for (var i = this.bruhListed.length - 1; i >= 0; i--) {
            if (this.bruhListed[i] === '') {
                this.bruhListed.splice(i, 1);
            }
        }
        console.log(this.bruhListed);
    },

    addbruhList(personID){
        var bruhList = readFileSync('assets/blacklist/blacklist.dat').toString().split('\r\n');
        if (bruhList.includes(personID))
            return false;
        bruhList.push(personID);
        this.bruhListed.push(personID);
        writeFileSync('assets/blacklist/blacklist.dat', bruhList.join('\r\n'));
        console.log(bruhList);
        return true;
    },

    removebruhList(personID){
        var bruhList = readFileSync('assets/blacklist/blacklist.dat').toString().split('\r\n');
        if (!bruhList.includes(personID))
            return false;
        bruhList.splice(bruhList.indexOf(personID), 1);
        this.bruhListed.splice(this.bruhListed.indexOf(personID), 1);
        writeFileSync('assets/blacklist/blacklist.dat', bruhList.join('\r\n'));
        return true;
    }
}