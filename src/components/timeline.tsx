import * as React from "react";
import { IMoment } from "./interfaces";
import { StringToTitleCase } from "./utils";
import MomentParser from "./moment-text-parser";

interface ITimelineProps {
	targetPlayer: number;
	moments: IMoment[];
}

interface ITimelineState {
}

export default class Timeline extends React.Component<ITimelineProps, ITimelineState> {
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
		// construct turnMap
		const turnMap = this.getTurnMap();

		let turnElems = [];

		for(let turn in turnMap) {
			let moments = [];
			moments.push(<div className="moment turn-number" key={ `turn-number-${turn}` }>{ turn }</div>);

			for(let moment of turnMap[turn]) {
				if(this.props.targetPlayer === -1 || moment.ActingPlayer === this.props.targetPlayer) {
					let type = StringToTitleCase(moment.Type.replace("MOMENT_", "").replace(/_/g, " "));
					if(moment.Type === "MOMENT_CITY_TRANSFERRED_FOREIGN_CAPITAL") {
						const t = MomentParser.parseForeignCapital(moment);
						console.log(t);
					}
					moments.push(
						<div className={ `moment ${moment.Type}` } key={ `moment-${moment.Id}` }>
							{ type }
						</div>
					);
				}
			}
			let turnElem = (
				<div className="turn" key={ `turn-${turn}` }>
					{ moments }
				</div>
			);
			turnElems.push(turnElem)
		}

		return (
			<div className="timeline">
				{ turnElems }
			</div>
		);
	}
}