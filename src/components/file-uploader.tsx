import * as React from "react";
import Dropzone from "react-dropzone";
import classNames from 'classnames'

import '../../css/file-uploader.css';

interface IFileUploaderProps {
	onFileUpload(file: File);
}

interface IFileUploaderState {
	selectedFile: (File | null);
	errorMsg: (string | null);
}

export default class FileUploader extends React.Component<IFileUploaderProps, IFileUploaderState> {

	fileRef: React.Ref<HTMLInputElement>;

	constructor(props: IFileUploaderProps) {
		super(props);

		this.state = {
			selectedFile: null,
			errorMsg: null,
		};

		this.fileRef = React.createRef();

		// because javascript is terrible
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleFileSelect = this.handleFileSelect.bind(this);
	}

	handleFileSelect(e: React.SyntheticEvent): void {
		const files = (this.fileRef as any).current.files as FileList;
		this.handleDrop(files, []);
	}

	handleSubmit(e: React.SyntheticEvent): void {
		this.props.onFileUpload(this.state.selectedFile);
	}

	handleDrop(acceptedFiles: (File[] | FileList), rejectedFiles: File[]) {
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
										<p>Drag and Drop a Civ VI base version or Rise&Fall timeline JSON file to get started</p>
									}
								</div>
							)
						}}
					</Dropzone>
				}

				{ !this.state.selectedFile ?
					<form role="form" className="file-upload-form">
						<label htmlFor="file">Or select the file from disk</label>
						<input type="file" name="file"
							className="btn"
							onChange={this.handleFileSelect}
							ref={this.fileRef}
							accept=".json" />
					</form>: null
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
