// imports
const path = require("path");
const fs = require("fs");
const minimist = require("minimist");

const timeline = require("./timeline");
const getMoments = timeline.getMoments;
const getPlayers = timeline.getPlayers;

// home
const HOME = process.env["HOME"];
const FNAME = path.join(HOME, "Dropbox/Civ 6/2019-02-18-1827-Cyrus.json");

function readFile(fname) {
    const contents = fs.readFileSync(fname).toString();
    const civObj = JSON.parse(contents);
    return civObj;
}

function main() {
    const argv = minimist(process.argv.slice(2));
    const civObj = readFile(FNAME);

    if(argv.players) {
        const players = getPlayers(civObj);
        console.log("players:");
        for(let player of players) {
            console.log(player);
            // console.log(`\t${player}`);
        }
    }

    if(argv.moments) {
        const moments = getMoments(civObj);
        console.log("moments:");
        for(let moment of moments) {
            console.log(moment);
        }
    }
}

main();
