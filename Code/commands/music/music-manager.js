var fs = require("fs");

var urls = [];
var names = [];

module.exports = {
    init(){
        loadurls();
        loadnames();
    },

    getRandomName(){
        return names[Math.floor(Math.random() * names.length)];
    },

    getRandomLink(){
        return urls[Math.floor(Math.random() * urls.length)];
    },

    amtOfSongs(){
        return names.length;
    }
}

function loadurls(){
    urls = [];
    urls = fs.readFileSync('assets/music/urls.dat').toString().split('\n');
}

function loadnames(){
    names = [];
    names = fs.readFileSync('assets/music/names.dat').toString().split('\r\n');
    for (var i = names.length - 1; i >= 0; i--){
        if (names[i] === ''){
            names.splice(i, 1);
        }
    }
}