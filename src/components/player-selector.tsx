import * as React from "react";
import { IPlayer } from "./interfaces";
import { StringToTitleCase } from "./utils";

interface IPlayerSelectorProps {
	players: IPlayer[];
	onSelectPlayer(playerIndex: number): void;
	currentlySelectedPlayer: number;
}

enum PlayerType {
	HUMAN = 1,
	CITY_STATE = 2,
	MAJOR_CIV = 3,
	BARBARIANS = 4,
	FREE_CITY = 5,
};

/**
 * Allow selecting from among the MAJOR civilizations participating in this game
 */
export default class PlayerSelector extends React.Component<IPlayerSelectorProps, {}> {
	constructor(props: IPlayerSelectorProps) {
		super(props);

		this.handleSelect = this.handleSelect.bind(this);
		this.getPlayerType = this.getPlayerType.bind(this);
		this.getCivName = this.getCivName.bind(this);
	}

	handleSelect(playerIndex: number) {
		console.log(playerIndex);
		this.props.onSelectPlayer(playerIndex);
	}

	getPlayerType(player: IPlayer): PlayerType {
		if(player.Id === 0) {
			return PlayerType.HUMAN;
		} else if(player.LeaderType.startsWith("LEADER_MINOR")) {
			return PlayerType.CITY_STATE;
		// R&F v Vanilla
		} else if(player.LeaderName === "Barbarians" || player.LeaderName === "LOC_CIVILIZATION_BARBARIAN_NAME") {
			return PlayerType.BARBARIANS;
		// R&F v Vanilla
		} else if(player.LeaderName === "Free Cities" || player.LeaderName === "LOC_CIVILIZATION_FREE_CITIES_NAME") {
			return PlayerType.FREE_CITY;
		} else {
			return PlayerType.MAJOR_CIV;
		}
	}

	// NOTE: reused in moment.tsx
	getCivName(player: IPlayer): string {
		// different data here if R&F or vanilla
		const civName = player.CivilizationShortDescription.startsWith("LOC_CIVILIZATION_") ?
			StringToTitleCase(player.Civilization.replace("CIVILIZATION_", "")):
			player.CivilizationShortDescription;
		return civName
	}

	render() {
		let playerElems = [];
		// let activeClass = (this.props.currentlySelectedPlayer === -1 ? "active": "");
		playerElems.push(
			<option
				// className={`btn btn-secondary player ${activeClass}`}
				onClick={(e) => this.handleSelect(-1)}
				key="all-players">
				All Players
		</option>
		);
		for(let player of this.props.players) {
			let playerType = this.getPlayerType(player);
			if(playerType === PlayerType.FREE_CITY ||
				playerType === PlayerType.BARBARIANS ||
				playerType === PlayerType.CITY_STATE) {
				// ignore everything but humans and major civs
				continue;
			}
			// activeClass = (player.Id === this.props.currentlySelectedPlayer ? "active": "");
			let civName = this.getCivName(player);
			playerElems.push(
				<option
					// className={`btn btn-secondary player ${activeClass}`}
					onClick={(e) => this.handleSelect(player.Id)}
					key={`player-${player.Id}`}>
					{civName}&nbsp;
					({playerType === PlayerType.HUMAN ? "You" : "AI"})
				</option>
			);
		}
		return <select className="custom-select player-selector">
			{ playerElems }
		</select>;
	}
}