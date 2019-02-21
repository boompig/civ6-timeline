// imports
const path = require("path");
const fs = require("fs");
const minimist = require("minimist");

const timeline = require("./timeline");
const getMoments = timeline.getMoments;
const getPlayers = timeline.getPlayers;

function readFile(fname) {
    const contents = fs.readFileSync(fname).toString();
    const civObj = JSON.parse(contents);
    return civObj;
}

function main() {
    const argv = minimist(process.argv.slice(2));

	if(!argv.f) {
		throw new Error("-f argument is required");
	}

	console.log(`Reading file '${argv.f}'`);
	const civObj = readFile(argv.f);

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
		let bins = Object.values(moments);
		// sort the bins in descending order
		bins.sort((a, b) => b - a);

		// remove duplicates
		bins = bins.filter((bin, i) => bins.indexOf(bin) === i);

		const rMap = {};
		for(let bin of bins) {
			rMap[bin] = [];
		}
		for(let moment in moments) {
			let bin = moments[moment];
			rMap[bin].push(moment);
		}

        console.log("moments:");
        for(let bin of bins) {
			// TODO for now
			if(bin < 5) {
				continue;
			}
			let list = rMap[bin].join(", ");
			console.log(`${bin} -> ${list}`);
        }
    }
}

main();
