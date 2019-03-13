import * as React from "react";

export default class Footer extends React.Component<{}, {}> {
	render() {
		return (<footer>
			<div>Created by Daniel Kats - 2019</div>
			<div>Limitations and more information can be found <a href="/about.html">here</a></div>
			<div>Source code on <a href="https://github.com/boompig/civ6-timeline">GitHub</a></div>
		</footer>);
	}
}