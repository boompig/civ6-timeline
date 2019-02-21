/**
 * This file parses historic moment-specific strings
 */

import { IMoment } from "./interfaces";

interface IForeignCapital {
	city: string;
	civ: string;
}

interface ITech {
	civ: string;
	era: string;
	tech: string;
}

interface ICivic {
	civ: string;
	civic: string;
	era: string;
}

/*
 * expected string format:
 * <city>, the former capital of <civ>, ...
 */
export default {
	parseForeignCapital: (moment: IMoment): IForeignCapital => {
		const pattern = /(.*?), the former capital of (.*?),/;
		const match = moment.InstanceDescription.match(pattern);
		// match[0] is the whole thing
		return {
			city: match[1],
			civ: match[2],
		};
	},

	// return the name of the civ
	parsePlayerMetMajor: (moment: IMoment): string => {
		const pattern = /of our meeting with the people of (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	// return the name of the natural wonder
	parseFindNaturalWonder: (moment: IMoment): string => {
		const pattern = /Explorers of (.*?) discover the majesty of (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		if (match === null) {
			throw new Error(`Failed to match natural wonder on string '${moment.InstanceDescription}'`);
		}
		// match[1] is the name of the civ
		return match[2];
	},

	// return the name of the natural wonder
	parseFindNaturalWonderFirstInWorld: (moment: IMoment): string => {
		const pattern = /Explorers of (.*?) are the first from a major civilization to set eyes on (.*?)!$/;
		const match = moment.InstanceDescription.match(pattern);
		// match[1] is the name of the civ
		return match[2];
	},

	// return the name of the era
	parseGameEntersAge: (moment: IMoment): string => {
		const pattern = /The game enters the (.*?) Era/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	// name of the GP
	parseGreatPersonCreated: (moment: IMoment): string => {
		const pattern = /After deliberation, (.*) chooses/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	parseTechResearchedInEraFirst: (moment: IMoment): ITech => {
		const pattern = /Many dispute the actual start of the (.*?) Era, but you know it was when (.*?) discovered (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		return {
			civ: match[2],
			era: match[1],
			tech: match[3],
		};
	},

	parseCivicResearchedInEraFirst: (moment: IMoment): ICivic => {
		// this line is long on purpose, so have the linter ignore it
		// tslint:disable-next-line
		const pattern = /Let others say what they will, but the real flourishing of (.*?) Era culture began with the discovery of (.*?) by (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		return {
			civ: match[3],
			civic: match[2],
			era: match[1],
		};
	},

	parseGovernmentTier1: (moment: IMoment): string => {
		const govs = ["Autocracy", "Oligarchy", "Classical Republic"];
		for (const gov of govs) {
			if (moment.InstanceDescription.indexOf(gov) >= 0) {
				return gov;
			}
		}
		throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
	},

	parseGovernmentTier2: (moment: IMoment): string => {
		const govs = ["Monarchy", "Theocracy", "Merchant Republic"];
		for (const gov of govs) {
			if (moment.InstanceDescription.indexOf(gov) >= 0) {
				return gov;
			}
		}
		throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
	},

	parseGovernmentTier3: (moment: IMoment): string => {
		const govs = ["Communism", "Fascism", "Democracy"];
		for (const gov of govs) {
			if (moment.InstanceDescription.indexOf(gov) >= 0) {
				return gov;
			}
		}
		throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
	},
};
