import * as React from "react";
import * as ReactTooltip from "react-tooltip";
import { IMoment } from "./interfaces";
import MomentParser from "./moment-text-parser";
import { StringToTitleCase } from "./utils";

interface IMomentProps {
	moment: IMoment;
}

export default class Moment extends React.PureComponent<IMomentProps, {}> {
	constructor(props: IMomentProps) {
		super(props);

		this.getName = this.getName.bind(this);
		this.getTooltipText = this.getTooltipText.bind(this);
	}

	getName(): string {
		const s = StringToTitleCase(this.props.moment.Type.replace("MOMENT_", "").replace(/_/g, " "));
		if(s === "Great Person Created Game Era") {
			return "Great Person Created";
		} else if (s === "Building Constructed Game Era Wonder") {
			return "Wonder Constructed";
		} else {
			return s;
		}
	}

	getTooltipText(moment: IMoment): string {
		if(moment.Type === "MOMENT_CITY_TRANSFERRED_FOREIGN_CAPITAL") {
			const capital = MomentParser.parseForeignCapital(moment);
			return `${capital.city} (${capital.civ})`;
		} else if(moment.Type === "MOMENT_PLAYER_MET_MAJOR") {
			return MomentParser.parsePlayerMetMajor(moment);
		} else if(moment.Type === "MOMENT_FIND_NATURAL_WONDER") {
			return MomentParser.parseFindNaturalWonder(moment);
		} else if(moment.Type === "MOMENT_FIND_NATURAL_WONDER_FIRST_IN_WORLD") {
			return MomentParser.parseFindNaturalWonderFirstInWorld(moment);
		} else if(moment.Type === "MOMENT_GAME_ERA_STARTED_WITH_GOLDEN_AGE" ||
				  moment.Type === "MOMENT_GAME_ERA_STARTED_WITH_NORMAL_AGE" ||
				  moment.Type === "MOMENT_GAME_ERA_STARTED_WITH_DARK_AGE") {
			return MomentParser.parseGameEntersAge(moment);
		} else if(moment.Type === "MOMENT_GREAT_PERSON_CREATED_GAME_ERA") {
			return MomentParser.parseGreatPersonCreated(moment);
		} else if(moment.Type === "MOMENT_TECH_RESEARCHED_IN_ERA_FIRST") {
			const tech = MomentParser.parseTechResearchedInEraFirst(moment);
			return `${tech.tech} -> ${tech.era}`;
		} else if(moment.Type === "MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST") {
			const civic = MomentParser.parseCivicResearchedInEraFirst(moment);
			return `${civic.civic} -> ${civic.era}`;
		} else if(moment.Type === "MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST_IN_WORLD") {
			return MomentParser.parseGovernmentTier1(moment);
		} else if(moment.Type === "MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST_IN_WORLD") {
			return MomentParser.parseGovernmentTier2(moment);
		} else if(moment.Type === "MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST_IN_WORLD") {
			return MomentParser.parseGovernmentTier3(moment);
		} else {
			return "";
		}
	}

	render() {
		const name = this.getName();
		const tooltipText = this.getTooltipText(this.props.moment);
		return (<div className={ `moment ${this.props.moment.Type}` } key={ `moment-${this.props.moment.Id}` }
			data-tip={ tooltipText }>
			{ name }
			{ tooltipText ? <ReactTooltip />: null }
		</div>);
	}
}