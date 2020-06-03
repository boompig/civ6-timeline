import * as moment from "moment";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {getRecentUploads} from "./api";

import "../../css/recent-uploads.css";

const NUM_RECENT_UPLOADS = 10;

interface IRecentUpload {
	created_at: string;
	file_hash: string;
	filename: string;
}

interface IState {
	isLoaded: boolean;
	recentUploads: IRecentUpload[];
}

interface IProps {}

export default class RecentUploads extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isLoaded: false,
			recentUploads: [],
		};

		this.getRecentUploads = this.getRecentUploads.bind(this);
	}

	public async getRecentUploads() {
		const response = await getRecentUploads();
		if (response.ok) {
			const j = await response.json();
			console.log("Loaded recent uploads from server:");
			console.log(j);
			this.setState({
				isLoaded: true,
				recentUploads: j.games,
			});
		} else {
			console.error("failed to load recent uploads");
			console.error(await response.text());
		}
	}

	public componentDidMount() {
		this.getRecentUploads();
	}

	/**
	 * Show most recent NUM_RECENT_UPLOADS uploads
	 * Sorted most recent first
	 */
	public render(): JSX.Element {
		const uploads = this.state.recentUploads.sort((a, b) => {
			const bDate = new Date(b.created_at);
			const aDate = new Date(a.created_at);
			return bDate.valueOf() - aDate.valueOf();
		}).map((metadata) => {
			const url = new URL(window.location.href);
			const filename = metadata.filename;
			const dateOffset = moment(metadata.created_at).fromNow();
			if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
				url.pathname = "/civ6-timeline";
			}
			url.searchParams.set("hash", metadata.file_hash);
			const link = url.toString();
			return <div className="recent-upload-game" key={metadata.file_hash}>
				<a href={link}>{ filename }</a>
				<span className="created-at">uploaded { dateOffset }</span>
			</div>;
		}).slice(0, NUM_RECENT_UPLOADS);
		if (this.state.isLoaded && this.state.recentUploads.length > 0) {
			return (<div className="recent-uploads">
				<p>Or view some of these recently uploaded files:</p>
				{ uploads }
			</div>);
		} else {
			return <div></div>;
		}
	}
}
