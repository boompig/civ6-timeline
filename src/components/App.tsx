import * as React from "react";
import { ITimelineData } from "./interfaces";
import Timeline from "./timeline"
import PlayerSelector from "./player-selector";

interface IAppState {
	serverData: (ITimelineData | null);
	targetPlayer: number;
}

interface IAppProps {}

export default class App extends React.Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
		super(props);

		this.state = {
			// data loaded from the server
			serverData: null,

			// which player to show the timeline for
			targetPlayer: -1,
		};

		this.loadData = this.loadData.bind(this);
		this.renderDataNotLoaded = this.renderDataNotLoaded.bind(this);
		this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
	}

	/**
	 * Pull some sample data from the server
	 */
	async loadData() {
		const response = await window.fetch("game-data/2019-02-18-1827-Cyrus.json");
		if(response.ok) {
			console.log("loaded server data:");
			const serverData = await response.json();
			console.log(serverData);
			return this.setState({
				serverData: (serverData as ITimelineData),
			});
		} else {
			console.error("Failed to load data");
		}
	}

	handleSelectPlayer(playerIndex: number | null): void {
		this.setState({
			targetPlayer: playerIndex
		});
	}

	renderDataNotLoaded() {
		return (<div>loading data...</div>);
	}

	componentDidMount() {
		this.loadData();
	}

	/**
	 * Show the timeline based on the data loaded from the server
	 */
	render() {
		if(this.state.serverData) {
			return (
				<div>
					<PlayerSelector
						onSelectPlayer={ this.handleSelectPlayer }
						players={this.state.serverData.Players}
						currentlySelectedPlayer={ this.state.targetPlayer }></PlayerSelector>
					<Timeline
						moments={ this.state.serverData.Moments }
						targetPlayer={ this.state.targetPlayer }></Timeline>
					<footer>Created by Daniel Kats - 2019</footer>
				</div>
			);
		} else {
			return this.renderDataNotLoaded();
		}
	}
}
