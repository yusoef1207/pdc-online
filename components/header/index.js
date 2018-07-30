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
				<div className="bottomMenu">
					<p style={{display:'inline-block',marginRight:'20px',fontWeight:'700',marginBottom:'0px'}}>Skala Jawaban : </p>
					<div style={{margin: '0px', fontSize: '15px'}} className="label-main">
							<label className="label label-info">4 = Yakin Sepenuhnya</label>
					</div>

						<div style={{margin: '0px', fontSize: '15px'}} className="label-main">
							<label className="label label-info">3 = Sangat Yakin</label>
					</div>

					<div style={{margin: '0px', fontSize: '15px'}} className="label-main">
							<label className="label label-info">2 = Cukup Yakin</label>
					</div>

					<div style={{margin: '0px', fontSize: '15px'}} className="label-main">
							<label className="label label-info">1 = Kurang Yakin</label>
					</div>

					<div style={{margin: '0px', fontSize: '15px'}} className="label-main">
							<label className="label label-info">0 = tidak yakin sepenuhnya</label>
					</div>
				</div>
				<div className="pcoded-container navbar-wrapper">

					<nav className="navbar header-navbar pcoded-header" >
						<div className="navbar-wrapper">
							<div className="navbar-logo" data-navbar-theme="theme4">
								<a href="#!">
									Personality Development Center
								</a>
								<a className="mobile-options">
									<i className="ti-more"></i>
								</a>
							</div>
							<div className="navbar-container container-fluid">

								<ul className="nav-right">
									<li className="user-profile header-notification">
										<a href="#!">
											<img src={user.photo} style={{borderRadius: '100%', height: '40px'}} alt="User-Profile-Image" />
											<span>{user.first_name}</span>
											<i className="ti-angle-down"></i>
										</a>
										<ul className="show-notification profile-notification">
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
										<span>ID :{user.applicant_id}</span>
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