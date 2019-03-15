import * as React from "react";
import { API_SERVER, API_TOKEN } from "./constants";
import FileUploader from "./file-uploader";
import Footer from "./footer";
import { IMetadata, ITimelineData } from "./interfaces";
import PlayerSelector from "./player-selector";
import ProgressBar from "./progress-bar";
import Timeline from "./timeline";

import "../../css/App.css";

interface IAppState {
	serverData: (ITimelineData | null);
	metadata: (IMetadata | null);
	targetPlayer: number;
	isFileUploaded: boolean;
	isFileLoaded: boolean;
	errorMsg: (null | string);
}

interface IAppProps { }

export default class App extends React.Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
		super(props);

		this.state = {
			// data loaded from the server
			serverData: null,

			// also data loaded from the server
			metadata: null,

			// which player to show the timeline for
			targetPlayer: -1,

			// set to true iff the user has provided a file
			isFileUploaded: false,

			// true when the data has been downloaded
			// used for progress, because serverData not set until file has been parsed
			isFileLoaded: false,

			// set when the file fails to parse
			errorMsg: null,
		};

		this.loadDataByHash = this.loadDataByHash.bind(this);
		this.renderDataNotLoaded = this.renderDataNotLoaded.bind(this);
		this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.parseFile = this.parseFile.bind(this);
	}

	/**
	 * Load data by hash from remote server
	 * @param hash Game hash
	 */
	public async loadDataByHash(hash: string) {
		const url = new URL(`${API_SERVER}/civ6-timeline/game/${hash}`);
		url.searchParams.append("token", API_TOKEN);
		// NOTE: passing a URL object is valid, but typescript is being stupid
		const response = await window.fetch((url as any), {
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
			},
			method: "GET",
			mode: "cors",
		});
		await this.setState({
			isFileLoaded: true,
		});

		const json = await response.json();
		if (response.ok) {
			console.log("data and metadata loaded from server successfully");
			const serverData = json.data;
			const metadata = json.metadata;
			// make sure that serverData at least has Moments and Players keys
			if ((!serverData.Moments) || (!serverData.Players)) {
				const msg = "server data must have both 'Moments' and 'Players' keys";
				console.error(msg);
				return this.setState({
					errorMsg: msg,
				});
			}
			console.log(metadata);
			this.setState({
				metadata,
				serverData,
			});
		} else {
			this.setState({
				errorMsg: json.message,
			});
		}
	}

	// NOTE: uncomment the section below to quickly load some data for testing the main timeline
	/*
	async loadLocalData() {
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
    */

	public parseUrlParams(): any {
		const query = window.location.search;
		const params = {};
		if (query) {
			for (const pair of query.substr(1).split("&")) {
				const i = pair.indexOf("=");
				const k = pair.slice(0, i);
				const v = pair.slice(i + 1);
				params[k] = v;
			}
		}
		return params;
	}

	public componentDidMount() {
		const params = this.parseUrlParams();
		console.log(params);
		if (params.hash) {
			this.setState({
				isFileUploaded: true,
			}, () => this.loadDataByHash(params.hash));
		}
		// NOTE: uncomment the section below to quickly load some data for testing the main timeline
		// this.loadLocalData();

		// NOTE: uncomment the section below to quickly test the appearance of the progress bar
		// console.log("Go!");
		// this.setState({
		// 	isFileUploaded: true,
		// 	serverData: null
		// });
	}

	public handleReset() {
		// do not reload, go back to selection page
		const url = `${window.location.protocol}//${window.location.host}`;
		window.location.href = url;
	}

	/**
	 * Read a file object as serverData
	 * @param file the file object retrieved from the server
	 */
	public async parseFile(file: File) {
		const reader = new FileReader();
		reader.onload = () => {
			console.log("[App] data successfully read from file");
			try {
				const contents = (reader.result as string);
				const serverData = JSON.parse(contents);

				// make sure that serverData at least has Moments and Players keys
				if ((!serverData.Moments) || (!serverData.Players)) {
					throw new Error("JSON must have both 'Moments' and 'Players' keys");
				}

				this.setState({
					serverData,
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
		reader.readAsText(file);
	}

	public async handleFileUpload(file: File, hash: string) {
		const url = `${window.location.protocol}//${window.location.host}?hash=${hash}`;
		// console.log(url);
		// redirect
		window.location.href = url;
		// return this.setState({
		// 	isFileUploaded: true,
		// }, () => {
		// 	console.log("[App] selected file");
		// 	// wait for state to change before doing the oother stuff
		// 	this.parseFile(file);
		// });
	}

	public handleSelectPlayer(playerIndex: number | null): void {
		this.setState({
			targetPlayer: playerIndex,
		});
	}

	public renderDataNotLoaded() {
		return (<div>loading data...</div>);
	}

	/**
	 * Show the timeline based on the data loaded from the server
	 */
	public render() {
		if (!this.state.isFileUploaded) {
			return <div>
				<FileUploader onFileUpload={this.handleFileUpload} />
				<Footer />
			</div>;
		} else if (this.state.errorMsg) {
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
		} else if (this.state.isFileUploaded && !this.state.errorMsg && !this.state.serverData) {
			// kind of arbitrary numbers
			const progress = this.state.isFileLoaded ? 80 : 35;
			return (<div>
				<div className="progress-container">
					<div>{this.state.isFileLoaded ? "Parsing..." : "Downloading..."}</div>
					<ProgressBar progress={progress} />
				</div>
				<Footer />
			</div>);
		} else if (this.state.serverData && this.state.metadata) {
			return (<div>
				<div>
					<h1 className="display-4">{this.state.metadata.filename}</h1>
					<div className="control-container">
						<PlayerSelector
							onSelectPlayer={this.handleSelectPlayer}
							players={this.state.serverData.Players}
							currentlySelectedPlayer={this.state.targetPlayer}></PlayerSelector>
						<button type="button"
							className="reset-btn btn btn-primary"
							onClick={this.handleReset}
						>Reset - Upload New File</button>
					</div>
					<Timeline
						moments={this.state.serverData.Moments}
						targetPlayer={this.state.targetPlayer}
						players={this.state.serverData.Players}></Timeline>
				</div>
				<Footer />
			</div>);
		} else {
			return this.renderDataNotLoaded();
		}
	}
}
