/**
 * This file parses historic moment-specific strings
 */

import { IMoment } from "./interfaces";

interface IForeignCapital {
	city: string;
	civ: string;
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
};
