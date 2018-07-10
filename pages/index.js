import LoginForm from "../components/loginForm";
import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import axios from 'axios';
import {getCookies} from "../utils/cookies";
import {imageUpload} from "../utils/image-upload";

import React, { Component } from "react";
import Webcam from 'react-webcam';

class Index extends Component {
	constructor (props) {
		super(props);
	}

	componentDidMount() {
		if(getCookies('PDCLOGID')) window.location.pathname = 'dashboard';
	}

	render () {
		return (<LoginForm />);
	}
}

export default Index;
