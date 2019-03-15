import * as React from "react";

interface IProgressBarProps {
	// number between 0 and 100
	progress: number;
}

export default class ProgressBar extends React.PureComponent<IProgressBarProps, {}> {
	public render() {
		const progressStyle = {
			width: `${this.props.progress}%`,
		};
		return (
			<div className="progress">
				<div className="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar"
					style={progressStyle}
					aria-valuenow={this.props.progress}
					aria-valuemin={0}
					aria-valuemax={100}></div>
			</div>
		);
	}
}
