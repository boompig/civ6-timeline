import * as React from "react";
import Dropzone from "react-dropzone";
import classNames from 'classnames'

interface IFileUploaderProps {
	onFileUpload(file: File);
}

interface IFileUploaderState {
	selectedFile: (File | null);
	errorMsg: (string | null);
}

export default class FileUploader extends React.Component<IFileUploaderProps, IFileUploaderState> {

	constructor(props: IFileUploaderProps) {
		super(props);

		this.state = {
			selectedFile: null,
			errorMsg: null,
		};

		// because javascript is terrible
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}

	handleSubmit(e: React.SyntheticEvent): void {
		this.props.onFileUpload(this.state.selectedFile);
	}

	handleDrop(acceptedFiles: File[], rejectedFiles: File[]) {
		const file = acceptedFiles[0];
		console.log("got file in Dropzone");
		if(file.type === "application/json") {
			this.setState({
				selectedFile: file,
				errorMsg: null,
			});
		} else {
			this.setState({
				selectedFile: null,
				errorMsg: "Invalid file type. JSON file format expected.",
			});
		}
	}

	render() {
		let errorMsgElem = null;
		if(this.state.errorMsg) {
			errorMsgElem = <div className="alert alert-danger">{ this.state.errorMsg }</div>
		}

		// NOTE: I took the dropzone stuff almost completely from the example on https://github.com/react-dropzone/react-dropzone
		return (
			<div className="file-uploader">
				<p className="instructions"></p>
				{ errorMsgElem}
				{ this.state.selectedFile ?
					<div className="alert alert-success">File upload successful</div> :
					<Dropzone onDrop={this.handleDrop}>
						{({ getRootProps, getInputProps, isDragActive }) => {
							return (
								<div
									{...getRootProps()}
									className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}
								>
									<input {...getInputProps()} />
									{ isDragActive ?
										<p>Drop files here...</p> :
										<p>Upload a Civ VI Rise&Fall timeline file to get started</p>
									}
								</div>
							)
						}}
					</Dropzone>
				}
				<button type="button"
					className="upload-btn form-control btn btn-primary"
					disabled={ this.state.errorMsg !== null || this.state.selectedFile === null }
					onClick={ this.handleSubmit }>
					Generate Timeline
				</button>
			</div>
		);
	}
}
