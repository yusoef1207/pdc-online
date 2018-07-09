import React, { Component } from "react";

import {removeCookie} from "../../utils/cookies"

class Navigation extends Component {
	constructor (props) {
		super(props);
	}

	logout () {
		removeCookie('PDCLOGID');
		removeCookie('PROG-ID');
		window.location.pathname = '/';
	}

	render () {
		const {user} = this.props;
		return (
			<div></div>
		);
	}
}

export default Navigation;