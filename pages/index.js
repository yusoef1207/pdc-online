
import React, { Component } from "react";
import LoginForm from "../components/loginForm";
import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import axios from 'axios';

import {getCookies} from "../utils/cookies";

class Index extends Component {
	constructor (props) {
		super(props);
	}

	componentWillMount() {
		if(typeof document !== 'undefined' || typeof window !== 'undefined')
			if(getCookies('PDCLOGID')) window.location.pathname = 'dashboard';
	}

	render () {
		return (<LoginForm />);
	}
}

export default Index;
