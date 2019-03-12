import * as React from "react";
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';
import { IMoment, IPlayer } from "./interfaces";
import MomentParser from "./moment-text-parser";
import { StringToTitleCase } from "./utils";

interface IMomentProps {
	moment: IMoment;
	actingPlayer: IPlayer;
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
		this.getCivName = this.getCivName.bind(this);
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

	/**
	 * Ignored moments (see about.html):
	 *
	 * - MOMENT_BATTLE_FOUGHT
	 * - MOMENT_SHIP_SUNK
	 * - MOMENT_GOODY_HUT_TRIGGERED
	 * - MOMENT_PANTHEON_FOUNDED
	 * - MOMENT_CITY_BUILT_ON_DESERT
	 * - MOMENT_BARBARIAN_CAMP_DESTROYED
	 */
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
		} else if(moment.Type === "MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST_IN_WORLD") {
			const civic = MomentParser.parseCivicResearchedInEraFirstInWorld(moment);
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
		} else if (moment.Type === "MOMENT_IMPROVEMENT_CONSTRUCTED_FIRST_UNIQUE") {
			return MomentParser.parseImprovementConstructedFirstUnique(moment);
		} else if (moment.Type === "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HOLY_SITE") {
			return MomentParser.parseDistrictConstructedHighAdjacencyHolySite(moment);
		} else if (moment.Type === "MOMENT_CITY_BUILT_NEAR_OTHER_CIV_CITY") {
			const forwardSettle = MomentParser.parseCityBuiltNearOtherCivCity(moment);
			return `${forwardSettle.yourCity} settled near ${forwardSettle.otherCiv}'s city of ${forwardSettle.otherCity}`;
		} else if (moment.Type === "MOMENT_TRADING_POST_CONSTRUCTED_IN_OTHER_CIV") {
			return MomentParser.parseTradingPostConstructedInOtherCiv(moment);
		} else if (moment.Type === "MOMENT_BARBARIAN_CAMP_DESTROYED_NEAR_YOUR_CITY") {
			return MomentParser.parseBarbarianCampDestroyedNearYourCity(moment);
		} else {
			return "";
		}
	}

	// NOTE: reused in player-selector.tsx
	getCivName(player: IPlayer): string {
		// different data here if R&F or vanilla
		const civName = player.CivilizationShortDescription.startsWith("LOC_CIVILIZATION_") ?
			StringToTitleCase(player.Civilization.replace("CIVILIZATION_", "")):
			player.CivilizationShortDescription;
		return civName
	}

	render() {
		const name = this.getName();
		const civName = this.getCivName(this.props.actingPlayer);
		let img = null;
		let tooltipText = "";
		if(icons[this.props.moment.Type]) {
			img = <img className="icon" src={ icons[this.props.moment.Type] } alt={ name } />
		}
		try {
			tooltipText = this.getTooltipText(this.props.moment);
		} catch (e) {
			// fail gracefully on parsing errors but log the errors to console
			console.error(e);
			tooltipText = "";
		}
		if(tooltipText) {
			// NOTE: using data-tip for CSS cursor here
			return (<Tooltip title={ tooltipText }>
				<div className={ `moment ${this.props.moment.Type}` }
					key={`moment-${this.props.moment.Id}`}
					data-tip={ tooltipText }>
					{ img }
					<span className="event-name">{ name }</span>
					<span className="civ-name">{ civName }</span>
				</div>
			</Tooltip>);
		} else {
			// NOTE: using data-tip for CSS cursor here (must specify empty value)
			return (<div className={ `moment ${this.props.moment.Type}` }
				key={`moment-${this.props.moment.Id}`}
				data-tip="">
				{ img }
				<span className="event-name">{ name }</span>
				<span className="civ-name">{ civName }</span>
			</div>);
		}
	}
}