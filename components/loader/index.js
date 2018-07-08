import React, { Component } from "react";

class Loader extends Component {
	constructor (props) {
		super(props);

		this.state = {
			email: null,
			password: null
		}
	
	}

	render () {
		return (
			<div className="theme-loader">
				<div className="ball-scale">
					<div></div>
				</div>
			</div>
		);
	}
}

export default Loader;