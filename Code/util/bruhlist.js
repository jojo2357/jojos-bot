const fs = require('fs');

module.exports = {
    bruhlisted: [''],

    loadbruhList() {
        this.bruhListed = [];
        this.bruhListed = fs.readFileSync('assets/blacklist/blacklist.dat').toString().split('\r\n');
        for (var i = this.bruhListed.length - 1; i >= 0; i--) {
            if (this.bruhListed[i] === '') {
                this.bruhListed.splice(i, 1);
            }
        }
        console.log(this.bruhListed);
    }
}