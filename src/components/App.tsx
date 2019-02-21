import * as React from "react";
import { ITimelineData } from "./interfaces";
import Timeline from "./timeline"
import PlayerSelector from "./player-selector";
import FileUploader from "./file-uploader";
import Footer from "./footer";

interface IAppState {
	serverData: (ITimelineData | null);
	targetPlayer: number;
	isFileUploaded: boolean;
	errorMsg: (null | string);
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

			// set to true iff the user has provided a file
			isFileUploaded: false,

			// set when the file fails to parse
			errorMsg: null
		};

		// this.loadData = this.loadData.bind(this);
		this.renderDataNotLoaded = this.renderDataNotLoaded.bind(this);
		this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.parseFile = this.parseFile.bind(this);
	}

	/*
	async loadData() {
		const response = await window.fetch("game-data/2019-02-18-1827-Cyrus.json");
		if(response.ok) {
			console.log("loaded server data:");
			const serverData = await response.json();
			console.log(serverData);
			return this.setState({
				serverData: (serverData as ITimelineData),
				isFileUploaded: true,
			});
		} else {
			console.error("Failed to load data");
		}
	}

	componentDidMount() {
		this.loadData();
	}
	*/

	handleReset() {
		window.location.reload();
		// this.setState({
		// 	isFileUploaded: false,
		// 	serverData: null,
		// 	targetPlayer: -1,
		// });
	}

	async parseFile(file: File) {
		const reader = new FileReader();
		reader.onload = () => {
			console.log("data successfully read from file");
			try {
				const contents = (reader.result as string);
				const serverData = JSON.parse(contents);

				// make sure that serverData at least has Moments and Players keys
				if((!serverData.Moments) || (!serverData.Players)) {
					throw new Error("JSON must have both 'Moments' and 'Players' keys");
				}

				this.setState({
					serverData: serverData,
				}, () => {
					return true;
				});
			} catch (e) {
				console.error(e);
				this.setState({
					errorMsg: `Failed to parse the input file: ${e.message}`,
				});
			}
		};
		// trigger the async callback above
		const contents = reader.readAsText(file);
	}

	async handleFileUpload(file: File) {
		return this.setState({
			isFileUploaded: true,
		}, () => {
			// wait for state to change before doing the oother stuff
			this.parseFile(file);
		});
	}

	handleSelectPlayer(playerIndex: number | null): void {
		this.setState({
			targetPlayer: playerIndex
		});
	}

	renderDataNotLoaded() {
		return (<div>loading data...</div>);
	}

	/**
	 * Show the timeline based on the data loaded from the server
	 */
	render() {
		if(!this.state.isFileUploaded) {
			return <div>
				<FileUploader onFileUpload={ this.handleFileUpload } />
				<Footer />
			</div>;
		} else if(this.state.errorMsg) {
			return (
				<div>
					<div className="alert alert-danger">
						<strong>Error:</strong>&nbsp;
						{this.state.errorMsg}
					</div>
					<button type="button"
						className="reset-btn btn btn-warning btn-lg"
						onClick={this.handleReset}
					>Reset</button>
				</div>
			);
		} else if(this.state.serverData) {
			return (
				<div>
					<button type="button"
						className="reset-btn btn btn-warning btn-lg"
						onClick={this.handleReset}
					>Reset</button>
					<PlayerSelector
						onSelectPlayer={ this.handleSelectPlayer }
						players={this.state.serverData.Players}
						currentlySelectedPlayer={ this.state.targetPlayer }></PlayerSelector>
					<Timeline
						moments={ this.state.serverData.Moments }
						targetPlayer={ this.state.targetPlayer }></Timeline>
					<Footer />
				</div>
			);
		} else {
			return this.renderDataNotLoaded();
		}
	}
}
