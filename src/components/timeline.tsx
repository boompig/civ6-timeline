import * as React from "react";
import { IMoment } from "./interfaces";
import { StringToTitleCase } from "./utils";
import MomentParser from "./moment-text-parser";
import * as ReactTooltip from "react-tooltip";
import Moment from "./moment";

interface ITimelineProps {
	targetPlayer: number;
	moments: IMoment[];
}

interface ITimelineState {
}

export default class Timeline extends React.PureComponent<ITimelineProps, ITimelineState> {
	constructor(props: ITimelineProps) {
		super(props);

		this.getTurnMap = this.getTurnMap.bind(this);
	}

	getTurnMap() {
		const turnMap = {};
		for(let moment of this.props.moments) {
			// don't add useless things to the turn map
			// if(this.props.targetPlayer >= 0 && moment.ActingPlayer !== this.props.targetPlayer) {
				// continue;
			// }

			if(!turnMap[moment.Turn]) {
				turnMap[moment.Turn] = []
			}
			turnMap[moment.Turn].push(moment);
		}
		return turnMap;
	}

	render() {
		console.log("Building turn map...");

		// construct turnMap
		const turnMap = this.getTurnMap();

		console.log("constructing elements...");

		let turnElems = [];

		for(let turn in turnMap) {
			let moments = [];
			moments.push(<div className="moment turn-number" key={ `turn-number-${turn}` }>{ turn }</div>);

			for(let moment of turnMap[turn]) {
				if(this.props.targetPlayer === -1 || moment.ActingPlayer === this.props.targetPlayer) {
					moments.push(<Moment moment={moment} key={ `moment-${moment.Id}` } />);
				}
			}
			let turnElem = (
				<div className="turn" key={ `turn-${turn}` }>
					{ moments }
				</div>
			);
			turnElems.push(turnElem);
		}
		console.log("ready to render");

		return (
			<div className="timeline">
				{ turnElems }
			</div>
		);
	}
}