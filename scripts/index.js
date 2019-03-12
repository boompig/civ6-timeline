#!/usr/bin/env node

// imports
const path = require("path");
const fs = require("fs");
const minimist = require("minimist");

const timeline = require("./timeline");
const getMoments = timeline.getMoments;
const getPlayers = timeline.getPlayers;

const SCRIPT = path.basename(process.argv[1]);

function readFile(fname) {
    const contents = fs.readFileSync(fname).toString();
    const civObj = JSON.parse(contents);
    return civObj;
}

/**
 * @param {IMoment[]} moments
 * @param {string} momentType
 * @returns {void}
 */
function printInstanceDescrForMomentType(moments, momentType) {
	for(let moment of moments) {
		if(moment.Type === momentType) {
			console.log(moment.InstanceDescription);
		}
	}
}

function reverseHistogram(histogram) {
	let bins = Object.values(histogram);

	// remove duplicate bins
	bins = bins.filter((bin, i) => bins.indexOf(bin) === i);

	const rMap = {};
	for(let bin of bins) {
		rMap[bin] = [];
	}
	for(let key in histogram) {
		let bin = histogram[key];
		rMap[bin].push(key);
	}
	return rMap;
}

function printHistogram(rMap) {
	const MIN_BIN_SIZE = 5;
	console.log("Moments:");
	let bins = Object.keys(rMap);
	// sort the bins in descending order
	bins.sort((a, b) => b - a);

	for(let bin of bins) {
		// TODO for now
		if(bin < MIN_BIN_SIZE) {
			continue;
		}
		let list = rMap[bin].join(", ");
		console.log(`${bin} -> ${list}`);
	}
}

/**
 * @param {string} filename
 */
function printMomentHistogramFromFile(filename) {
	console.log(`Reading file '${filename}'`);
	const civObj = readFile(filename);
	const histogram = getMoments(civObj);
	const bins = reverseHistogram(histogram);
	printHistogram(bins);
}

function printMomentHistogramFromDirectory(dirname) {
	const filenames = fs.readdirSync(dirname);
	// master histogram
	const histogram = {};
	for (let filename of filenames) {
		let path = `${dirname}/${filename}`;
		console.log(`Reading file '${path}'...`);
		let civObj = readFile(path);
		// per-filename histogram
		let moments = getMoments(civObj);
		for(let k in moments) {
			if (k in histogram) {
				histogram[k] += moments[k];
			} else {
				histogram[k] = moments[k];
			}
		}
	}
	const bins = reverseHistogram(histogram);
	printHistogram(bins);
}

/**
 * @param {string} filename
 */
function printPlayers(filename) {
	console.log(`Reading file '${filename}'`);
	let civObj = readFile(filename);
	const players = getPlayers(civObj);
	console.log("players:");
	for(let player of players) {
		console.log(player);
		// console.log(`\t${player}`);
	}
}

function printUsage() {
	console.log(`Usage: ${SCRIPT} [ --histogram | --players | --pattern ]`);
	console.log(" - histogram		Get a histogram of all moments present in the given file");
	console.log(" - players			Get a list of all players present in the given file");
	console.log(" - pattern			Find all instance descriptions of the given moment in the given file");
	return;
}

function main() {
	const argv = minimist(process.argv.slice(2));

	if (argv.help) {
		printUsage();
		return;
	}

    if(argv.players) {
		if(!argv.f) {
			throw new Error("-f argument is required");
		}
		printPlayers(argv.f);
	} else if(argv.histogram) {
		if (argv.f) {
			printMomentHistogramFromFile(argv.f);
		} else if (argv.d) {
			printMomentHistogramFromDirectory(argv.d);
		} else {
			console.error(`Usage: ${SCRIPT} --histogram ( -f <filename> | -d <dirname> )`);
			return;
		}
	} else if(argv.pattern) {
		if(!argv.type || !argv.f) {
			console.error("--type must be specified when using the --pattern flag");
			console.error(`Usage: ${SCRIPT} --pattern -f <filename> --type <moment-type>`);
			return;
		}
		console.log(`Reading file '${argv.f}'`);
		let civObj = readFile(argv.f);
		printInstanceDescrForMomentType(civObj.Moments, argv.type);
	} else {
		console.error("Error: no command specified");
		printUsage();
	}
}

main();
