import * as React from "react";
import { IPlayer } from "./interfaces";

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
		} else if(player.LeaderName === "Barbarians") {
			return PlayerType.BARBARIANS;
		} else if(player.LeaderName === "Free Cities") {
			return PlayerType.FREE_CITY;
		} else {
			return PlayerType.MAJOR_CIV;
		}
	}

	render() {
		let playerElems = [];
		let activeClass = (this.props.currentlySelectedPlayer === -1 ? "active": "");
		playerElems.push(<button className={ `btn btn-secondary player ${activeClass}` } onClick={ (e) => this.handleSelect(-1) } key="all-players">
			All Players
		</button>);
		for(let player of this.props.players) {
			let playerType = this.getPlayerType(player);
			if(playerType === PlayerType.FREE_CITY ||
				playerType === PlayerType.BARBARIANS ||
				playerType === PlayerType.CITY_STATE) {
				// ignore everything but humans and major civs
				continue;
			}
			activeClass = (player.Id === this.props.currentlySelectedPlayer ? "active": "");
			playerElems.push(<button className={ `btn btn-secondary player ${activeClass}` } onClick={ (e) => this.handleSelect(player.Id) } key={ `player-${player.Id}` }>
				<span>{ player.CivilizationShortDescription }</span>
				<span>({ playerType === PlayerType.HUMAN ? "You": player.CivilizationShortDescription })</span>
			</button>);
		}
		return <div className="btn-group player-selector" role="group" aria-label="player selector">
			{ playerElems}
		</div>
	}
}