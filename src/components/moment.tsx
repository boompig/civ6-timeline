import * as React from "react";
import * as ReactTooltip from "react-tooltip";
import { IMoment } from "./interfaces";
import MomentParser from "./moment-text-parser";
import { StringToTitleCase } from "./utils";

interface IMomentProps {
	moment: IMoment;
}

const icons = {
	"MOMENT_ARTIFACT_EXTRACTED": "https://vignette.wikia.nocookie.net/civilization/images/8/87/Artifact6.png/revision/latest?cb=20161108220057",
	// "MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST": "https://vignette.wikia.nocookie.net/civilization/images/2/2a/Civ6Culture.png/revision/latest?cb=20161108204306",
	// "MOMENT_TECH_RESEARCHED_IN_ERA_FIRST": "https://vignette.wikia.nocookie.net/civilization/images/7/79/Civ6Science.png/revision/latest?cb=20161108210007",
	"MOMENT_PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR": "https://vignette.wikia.nocookie.net/civilization/images/2/24/Envoy6.png/revision/latest?cb=20161107201124",
	"MOMENT_PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD": "https://vignette.wikia.nocookie.net/civilization/images/2/24/Envoy6.png/revision/latest?cb=20161107201124",
	"MOMENT_RELIGION_FOUNDED": "https://vignette.wikia.nocookie.net/civilization/images/8/82/Civ6Faith.png/revision/latest?cb=20161108205537",
	"MOMENT_RELIGION_FOUNDED_FIRST_IN_WORLD": "https://vignette.wikia.nocookie.net/civilization/images/8/82/Civ6Faith.png/revision/latest?cb=20161108205537",
	"MOMENT_PANTHEON_FOUNDED": "https://vignette.wikia.nocookie.net/civilization/images/8/82/Civ6Faith.png/revision/latest?cb=20161108205537",
	"MOMENT_PANTHEON_FOUNDED_FIRST_IN_WORLD": "https://vignette.wikia.nocookie.net/civilization/images/8/82/Civ6Faith.png/revision/latest?cb=20161108205537",
};

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
		} else if(moment.Type === "MOMENT_GREAT_PERSON_CREATED_GAME_ERA" ||
			moment.Type === "MOMENT_GREAT_PERSON_CREATED_PAST_ERA") {
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
		} else if(moment.Type === "MOMENT_BUILDING_CONSTRUCTED_PAST_ERA_WONDER" ||
			moment.Type === "MOMENT_BUILDING_CONSTRUCTED_GAME_ERA_WONDER") {
			return MomentParser.parseWonderConstructed(moment);
		} else if (moment.Type === "MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC") {
			return MomentParser.parseUnitCreatedStrategic(moment);
		} else if (moment.Type === "MOMENT_PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD") {
			return MomentParser.parseSuzerain(moment);
		} else if (moment.Type === "MOMENT_PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR") {
			return MomentParser.parseEnvoyCanceledDuringWar(moment);
		} else if (moment.Type === "MOMENT_UNIT_CREATED_FIRST_UNIQUE") {
			return MomentParser.parseUnitCreatedUnique(moment);
		} else if (moment.Type === "MOMENT_RELIGION_FOUNDED") {
			return MomentParser.parseReligionFounded(moment);
		} else if (moment.Type === "MOMENT_RELIGION_FOUNDED_FIRST_IN_WORLD") {
			return MomentParser.parseReligionFoundedFirstInWorld(moment);
		// } else if (moment.Type === "MOMENT_PANTHEON_FOUNDED") {
			// return MomentParser.parsePantheon(moment);
		} else {
			return "";
		}
	}

	render() {
		const name = this.getName();
		let img = null;
		if(icons[this.props.moment.Type]) {
			img = <img className="icon" src={ icons[this.props.moment.Type] } alt={ name } />
		}
		const tooltipText = this.getTooltipText(this.props.moment);
		return (<div className={ `moment ${this.props.moment.Type}` } key={ `moment-${this.props.moment.Id}` }
			data-tip={ tooltipText }>
			{ img }
			<span>{ name }</span>
			{ tooltipText ? <ReactTooltip />: null }
		</div>);
	}
}