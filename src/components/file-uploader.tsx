import classNames from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";

import "../../css/file-uploader.css";
import { API_SERVER, API_TOKEN } from "./constants";
import ProgressBar from "./progress-bar";

interface IFileUploaderProps {
	onFileUpload(file: File, hash: string);
}

interface IFileUploaderState {
	selectedFile: (File | null);
	errorMsg: (string | null);
	isUploading: boolean;
	serverFileHash: (string | null);
}

export default class FileUploader extends React.Component<IFileUploaderProps, IFileUploaderState> {

	public fileRef: React.Ref<HTMLInputElement>;

	constructor(props: IFileUploaderProps) {
		super(props);

		this.state = {
			errorMsg: null,
			isUploading: false,
			selectedFile: null,
			serverFileHash: null,
		};

		this.fileRef = React.createRef();

		// because javascript is terrible
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleFileSelect = this.handleFileSelect.bind(this);
		this.renderFileUploadForm = this.renderFileUploadForm.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.renderHasUploaded = this.renderHasUploaded.bind(this);
		this.reset = this.reset.bind(this);
	}

	public reset() {
		window.location.reload();
	}

	public async uploadFile(file: File) {
		const formData = new FormData();
		formData.append("token", API_TOKEN);
		formData.append("timeline", file);
		const response = await window.fetch(`${API_SERVER}/civ6-timeline/upload`, {
			body: formData,
			cache: "no-cache",
			method: "POST",
			mode: "cors",
		});
		// console.log(response);
		const json = await response.json();
		console.log(json);
		if (response.ok) {
			this.setState({
				serverFileHash: json.hash,
			}, () => {
				this.props.onFileUpload(this.state.selectedFile, this.state.serverFileHash);
			});
		} else {
			if (json && json.hash) {
				this.setState({
					serverFileHash: json.hash,
				}, () => {
					this.props.onFileUpload(this.state.selectedFile, this.state.serverFileHash);
				});
			} else {
				const body = await response.text();
				this.setState({
					errorMsg: body,
					isUploading: false,
					selectedFile: null,
					serverFileHash: null,
				});
			}
		}
	}

	/**
	 * When the user submits the file using the file-open dialog
	 */
	public handleFileSelect(e: React.SyntheticEvent): void {
		const files = (this.fileRef as any).current.files as FileList;
		this.handleDrop(files, []);
	}

	/**
	 * File has been selected and user clicks "Upload and Generate Timeline"
	 */
	public handleSubmit(e: React.SyntheticEvent): void {
		this.setState({
			isUploading: true,
		}, () => this.uploadFile(this.state.selectedFile));
		// this.props.onFileUpload(this.state.selectedFile);
	}

	/**
	 * When the user submits the file using drag and drop
	 */
	public handleDrop(acceptedFiles: (File[] | FileList), rejectedFiles: File[]) {
		const file = acceptedFiles[0];
		console.log("got file in Dropzone");
		if (file.type === "application/json") {
			this.setState({
				errorMsg: null,
				selectedFile: file,
			});
		} else {
			this.setState({
				errorMsg: "Invalid file type. JSON file format expected.",
				selectedFile: null,
			});
		}
	}

	public renderFileUploadForm() {
		let errorMsgElem = null;
		if (this.state.errorMsg) {
			errorMsgElem = <div className="alert alert-danger">{this.state.errorMsg}</div>;
		}
		const mb = this.state.selectedFile ? (this.state.selectedFile.size / (1024 * 1024)).toFixed(2) : 0;
		// NOTE: I took the dropzone stuff almost completely from the example on
		// https://github.com/react-dropzone/react-dropzone
		return (
			<div className="file-uploader">
				<p className="instructions"></p>
				{errorMsgElem}
				{this.state.selectedFile ?
					<div className="alert alert-success">File selected - {mb}MB </div> :
					<Dropzone onDrop={this.handleDrop}>
						{({ getRootProps, getInputProps, isDragActive }) => {
							return (
								<div
									{...getRootProps()}
									className={classNames("dropzone", { "dropzone--isActive": isDragActive })}
								>
									<input {...getInputProps()} />
									{isDragActive ?
										<p>Drop files here...</p> :
										<p>Drag and Drop a Civ VI base version or Rise&Fall timeline JSON file to get started</p>
									}
								</div>
							);
						}}
					</Dropzone>
				}

				{!this.state.selectedFile ?
					<form role="form" className="file-upload-form">
						<label htmlFor="file">Or select the file from disk</label>
						<input type="file" name="file"
							className="btn"
							onChange={this.handleFileSelect}
							ref={this.fileRef}
							accept=".json" />
					</form> : null
				}
				<button type="button"
					className="upload-btn form-control btn btn-primary"
					disabled={this.state.errorMsg !== null || this.state.selectedFile === null}
					onClick={this.handleSubmit}>
					Upload and Generate Timeline
				</button>
			</div>
		);
	}

	public renderUploadProgress() {
		// just a made-up number
		return (<div className="file-uploader">
			{this.state.errorMsg ? this.state.errorMsg :
				<div>
					<p>Uploading file...</p>
					<ProgressBar progress={65} />
				</div>}
		</div>);
	}

	public renderHasUploaded() {
		const redirectUrl = `${window.location.protocol}//${window.location.host}?hash=${this.state.serverFileHash}`;
		return (<div className="file-uploader">
			<div className="alert alert-success">File has successfully uploaded</div>
			<a href={redirectUrl} className="btn btn-primary">Click here to see the timeline</a>
			<button onClick={this.reset} className="btn btn-warning">Reset</button>
		</div>);
	}

	public render() {
		if (this.state.serverFileHash) {
			return this.renderHasUploaded();
		} else if (this.state.isUploading) {
			return this.renderUploadProgress();
		} else {
			return this.renderFileUploadForm();
		}
	}
}
