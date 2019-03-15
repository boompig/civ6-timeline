import * as React from "react";
import { IMoment, IPlayer } from "./interfaces";
import Moment from "./moment";

import "../../css/timeline.css";

interface ITimelineProps {
	targetPlayer: number;
	moments: IMoment[];
	players: IPlayer[];
}

interface ITimelineState {
}

export default class Timeline extends React.PureComponent<ITimelineProps, ITimelineState> {
	constructor(props: ITimelineProps) {
		super(props);

		this.getTurnMap = this.getTurnMap.bind(this);
	}

	public getTurnMap() {
		const turnMap = {};
		for (const moment of this.props.moments) {
			// don't add useless things to the turn map
			// if(this.props.targetPlayer >= 0 && moment.ActingPlayer !== this.props.targetPlayer) {
			// continue;
			// }

			if (!turnMap[moment.Turn]) {
				turnMap[moment.Turn] = [];
			}
			turnMap[moment.Turn].push(moment);
		}
		return turnMap;
	}

	public render() {
		console.log("Building turn map...");

		// construct turnMap
		const turnMap = this.getTurnMap();

		console.log("constructing elements...");

		const turnElems = [];

		for (const turn in turnMap) {
			const moments = [];

			for (const moment of turnMap[turn]) {
				if (this.props.targetPlayer === -1 || moment.ActingPlayer === this.props.targetPlayer) {
					moments.push(<Moment
						moment={moment}
						key={`moment-${moment.Id}`}
						actingPlayer={this.props.players[moment.ActingPlayer]} />);
				}
			}
			const turnElem = (
				<div className="turn" key={`turn-${turn}`}>
					<div className="turn-number-container">
						<div className="turn-number" key={`turn-number-${turn}`}>{turn}</div>
					</div>
					{moments}
				</div>
			);
			turnElems.push(turnElem);
		}
		console.log("ready to render");

		return (
			<div className="timeline">
				{turnElems}
			</div>
		);
	}
}
