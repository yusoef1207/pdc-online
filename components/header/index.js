import React, { Component } from "react";
import {removeCookie} from "../../utils/cookies"

class Header extends Component {
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
			<div>
				<div className="pcoded-overlay-box"></div>
				<div className="pcoded-container navbar-wrapper">

					<nav className="navbar header-navbar pcoded-header" >
						<div className="navbar-wrapper">
							<div className="navbar-logo" data-navbar-theme="theme4">
								<a className="mobile-menu" id="mobile-collapse" href="#!">
									<i className="ti-menu"></i>
								</a>
								<a className="mobile-search morphsearch-search" href="#">
									<i className="ti-search"></i>
								</a>
								<a href="#!">
									Personality Development Center
								</a>
								<a className="mobile-options">
									<i className="ti-more"></i>
								</a>
							</div>
							<div className="navbar-container container-fluid">
								<ul className="nav-left">
									<li>
										<div className="sidebar_toggle"><a href="javascript:void(0)"><i className="ti-menu"></i></a></div>
									</li>
								</ul>


								<ul className="nav-right">
									<li className="user-profile header-notification">
										<a href="#!">
											<img src="/static/images/user.png" alt="User-Profile-Image" />
											<span>{user.first_name}</span>
											<i className="ti-angle-down"></i>
										</a>
										<ul className="show-notification profile-notification">
											<li>
												<a href="auth-lock-screen.html">
													<i className="ti-lock"></i> Lock Screen
												</a>
											</li>
											<li>
												<a href="#" onClick={this.logout.bind(this)}>
													<i className="ti-layout-sidebar-left"></i> Logout
												</a>
											</li>
										</ul>
									</li>
								</ul>
								<div className="upgrade-button m-r-10 f-right">
									<a href="#" className="icon-circle txt-white btn btn-sm btn-warning upgrade-button">
										<span>ID : 92131293</span>
									</a>
								</div> 
							</div>
						</div>
					</nav>	
				</div>
			</div>
		);
	}
}

export default Header;