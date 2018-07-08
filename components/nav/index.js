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
			<nav className="pcoded-navbar" >
				<div className="sidebar_toggle"><a href="#"><i className="icon-close icons"></i></a></div>
					<div className="pcoded-inner-navbar main-menu">
					<div className="">
						<div className="main-menu-header">
							<img className="img-40" src="/static/images/user.png" alt="User-Profile-Image" />
							<div className="user-details">
							<span>{user.first_name}</span>
							<span id="more-details">{user.position}</span>
						</div>
					</div>
				</div>
				<div className="pcoded-navigatio-lavel">Side Menu</div>
					<ul className="pcoded-item pcoded-left-item">
						<li className="active pcoded-trigger ">
							<a href="index.html ">
								<span className="pcoded-micon"><i className="ti-layout-grid2-alt"></i></span>
								<span className="pcoded-mtext">Dashboard</span>
								<span className="pcoded-mcaret"></span>
							</a>
						</li>
					</ul>
					<ul className="pcoded-item pcoded-left-item">
						<li className="">
							<a href="#">
								<span className="pcoded-micon"><i className="ti-crown"></i></span>
								<span className="pcoded-mtext">Your Score</span>
								<span className="pcoded-mcaret"></span>
							</a>
						</li>
						<li className="">
							<a href="#">
								<span className="pcoded-micon"><i className="ti-lock"></i></span>
								<span className="pcoded-mtext" onClick={this.logout.bind(this)}>Logout</span>
								<span className="pcoded-mcaret"></span>
							</a>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}

export default Navigation;