/**
 * This file parses Historic Moment-specific strings
 * See https://civilization.fandom.com/wiki/Historic_Moments_(Civ6) for details
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
	/**
	 * Moment: MOMENT_CITY_TRANSFERRED_FOREIGN_CAPITAL
	 */
	parseForeignCapital: (moment: IMoment): IForeignCapital => {
		const pattern = /(.*?), the former capital of (.*?),/;
		const match = moment.InstanceDescription.match(pattern);
		// match[0] is the whole thing
		return {
			city: match[1],
			civ: match[2],
		};
	},

	/**
	 * Moment: MOMENT_PLAYER_MET_MAJOR
	 * @returns the name of the civ
	 */
	parsePlayerMetMajor: (moment: IMoment): string => {
		const pattern = /of our meeting with the people of (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	/**
	 * Moment: MOMENT_FIND_NATURAL_WONDER
	 * @returns the name of the natural wonder
	 */
	parseFindNaturalWonder: (moment: IMoment): string => {
		const pattern = /Explorers of (.*?) discover the majesty of (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		if (match === null) {
			throw new Error(`Failed to match natural wonder on string '${moment.InstanceDescription}'`);
		}
		// match[1] is the name of the civ
		return match[2];
	},

	/**
	 * @returns the name of the natural wonder
	 */
	parseFindNaturalWonderFirstInWorld: (moment: IMoment): string => {
		const pattern = /Explorers of (.*?) are the first from a major civilization to set eyes on (.*?)!$/;
		const match = moment.InstanceDescription.match(pattern);
		// match[1] is the name of the civ
		return match[2];
	},

	/**
	 * Moments:
	 *
	 * 	- MOMENT_GAME_ERA_STARTED_WITH_NORMAL_AGE
	 *  - MOMENT_GAME_ERA_STARTED_WITH_GOLDEN_AGE
	 *  - MOMENT_GAME_ERA_STARTED_WITH_DARK_AGE
	 *
	 * @returns the name of the era
	 */
	parseGameEntersAge: (moment: IMoment): string => {
		const pattern = /The game enters the (.*?) Era/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	/**
	 * Moments:
	 *
	 * - MOMENT_GREAT_PERSON_CREATED_PAST_ERA
	 * - MOMENT_GREAT_PERSON_CREATED_GAME_ERA
	 *
	 * @returns the name of the GP
	 */
	parseGreatPersonCreated: (moment: IMoment): string => {
		const pattern = /After deliberation, (.*) chooses/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	/**
	 * Moment: MOMENT_TECH_RESEARCHED_IN_ERA_FIRST
	 */
	parseTechResearchedInEraFirst: (moment: IMoment): ITech => {
		const pattern = /Many dispute the actual start of the (.*?) Era, but you know it was when (.*?) discovered (.*?).$/;
		const match = moment.InstanceDescription.match(pattern);
		return {
			civ: match[2],
			era: match[1],
			tech: match[3],
		};
	},

	/**
	 * Moment: MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST
	 */
	parseCivicResearchedInEraFirst: (moment: IMoment): ICivic => {
		// this line is long on purpose, so have the linter ignore it
		// tslint:disable-next-line
		let pattern = /Let others say what they will, but the real flourishing of (.*?) Era culture began with the discovery of (.*?) by (.*?).$/;
		let match = moment.InstanceDescription.match(pattern);
		if(match) {
			return {
				civ: match[3],
				civic: match[2],
				era: match[1],
			};
		} else {
			pattern = /Let others say what they will, but the real flourishing of (.*?) Era culture began with the rise of (.*?) in (.*?).$/;
			match = moment.InstanceDescription.match(pattern);
			if(match) {
				return {
					civ: match[3],
					civic: match[2],
					era: match[1],
				};
			} else {
				throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
			}
		}
	},

	/**
	 * @returns the name of the government
	 */
	parseGovernmentTier1: (moment: IMoment): string => {
		const govs = ["Autocracy", "Oligarchy", "Classical Republic"];
		for (const gov of govs) {
			if (moment.InstanceDescription.indexOf(gov) >= 0) {
				return gov;
			}
		}
		throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
	},

	/**
	 * @returns the name of the government
	 */
	parseGovernmentTier2: (moment: IMoment): string => {
		const govs = ["Monarchy", "Theocracy", "Merchant Republic"];
		for (const gov of govs) {
			if (moment.InstanceDescription.indexOf(gov) >= 0) {
				return gov;
			}
		}
		throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
	},

	/**
	 * @returns the name of the government
	 */
	parseGovernmentTier3: (moment: IMoment): string => {
		const govs = ["Communism", "Fascism", "Democracy"];
		for (const gov of govs) {
			if (moment.InstanceDescription.indexOf(gov) >= 0) {
				return gov;
			}
		}
		throw new Error(`Match failed on string: ${moment.InstanceDescription}`);
	},

	/**
	 * Moments:
	 *
	 * - MOMENT_BUILDING_CONSTRUCTED_PAST_ERA_WONDER
	 * - MOMENT_BUILDING_CONSTRUCTED_GAME_ERA_WONDER
	 *
	 * @returns the name of the wonder
	 */
	parseWonderConstructed: (moment: IMoment): string => {
		const pattern = /Standing in the (.*?),/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	/**
	 * Moment: MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC
	 *
	 * @returns the name of the unit
	 */
	parseUnitCreatedStrategic: (moment: IMoment): string => {
		let pattern = /But we know now that they are a formidable weapon for our (.*?).$/;
		let match = moment.InstanceDescription.match(pattern);
		if (match === null) {
			pattern = /But we know now that it is a formidable weapon for our (.*?).$/;
			match = moment.InstanceDescription.match(pattern);
			return match[1];
		} else {
			return match[1];
		}
	},

	/**
	 * Moment: MOMENT_UNIT_CREATED_FIRST_UNIQUE
	 *
	 * @returns the name of the unit
	 */
	parseUnitCreatedUnique: (moment: IMoment): string => {
		const pattern = /Who but (.*?) could create the (.*?)\?/;
		const match = moment.InstanceDescription.match(pattern);
		return match[2];
	},

	/**
	 * Moment: MOMENT_PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD
	 * @returns the name of the City-State
	 */
	parseSuzerain: (moment: IMoment): string => {
		const pattern = /The rulers of (.*?) bow/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},

	/**
	 * Moment: MOMENT_PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR
	 * @returns the name of the City-State
	 */
	parseEnvoyCanceledDuringWar: (moment: IMoment): string => {
		// this line is long on purpose, so have the linter ignore it
		// tslint:disable-next-line
		const pattern = /Previous mercenary contracts are subject to renegotiation, when (.*?) overturns the old Suzerain of (.*?)./;
		const match = moment.InstanceDescription.match(pattern);
		// match[1] is civ
		return match[2];
	},

	/**
	 * Moment: MOMENT_PANTHEON_FOUNDED
	 */
	parsePantheon: (moment: IMoment): string => {
		throw new Error("Pantheon not found");
	},

	/**
	 * Moment: MOMENT_RELIGION_FOUNDED_FIRST_IN_WORLD
	 * @returns name of the religion
	 */
	parseReligionFoundedFirstInWorld: (moment: IMoment): string => {
		const pattern = /It is said that when (.*?) founded (.*?),/;
		const match = moment.InstanceDescription.match(pattern);
		// match[1] is civ
		return match[2];
	},

	/**
	 * Moment: MOMENT_RELIGION_FOUNDED
	 * @returns name of the religion
	 */
	parseReligionFounded: (moment: IMoment): string => {
		const pattern = /(.*?) is the true path of salvation!/;
		const match = moment.InstanceDescription.match(pattern);
		return match[1];
	},
};
