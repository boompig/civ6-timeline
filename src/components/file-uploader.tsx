import * as React from "react";

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
		this.handleSelectFile = this.handleSelectFile.bind(this);
	}

	handleSubmit(e: React.SyntheticEvent): void {
		this.props.onFileUpload(this.state.selectedFile);
	}

	handleSelectFile(e: React.SyntheticEvent): void {
		e.preventDefault();
		console.log("selected file");
		// FIXME: typescript doesn't register the files property
		const file = (e.target as any).files[0];
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

		return (
			<div className="dropzone file-uploader">
				<p className="instructions">Upload a Civ VI Rise&Fall timeline file to start</p>
				{ errorMsgElem}
				<form role="form" >
					<input type="file"
						onChange={this.handleSelectFile} />
					<button type="button"
						className="upload-btn form-control btn btn-primary"
						disabled={ this.state.errorMsg !== null || this.state.selectedFile === null }
						onClick={ this.handleSubmit }>
						Generate Timeline
					</button>
				</form>
			</div>
		);
	}
}
