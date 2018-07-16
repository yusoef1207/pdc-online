import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import axios from 'axios';
import {getCookies, setCookies} from "../utils/cookies";
import React, { Component } from "react";

class Dashboard extends Component {
	constructor (props) {
		super(props);
		this.backendUrl = process.env.BACKEND_URL;

		this.state = {
			program: [],
			user: {},
			isLoading: true
		}
	}

	componentDidMount () {
		if(getCookies('PDCLOGID')) {
			axios.get(`${this.backendUrl}/program`).then((res) => {
				if(res.data) this.setState({program: res.data})
			})
			var catchLog = JSON.parse(decodeURIComponent(getCookies('PDCLOGID')));

			axios.get(`${this.backendUrl}/user/${catchLog.u}`).then(res => {
				if(res.data) this.setState({user: res.data, isLoading: false})
			})
		}else {
			window.location.pathname = '/';
		}
	}

	startQuestion (progId) {
		setCookies('PROG-ID', progId);
		window.location.pathname = '/before-start';
	}

	render () {
		const {user, isLoading} = this.state;

		return (
			<div>
				<LoadComponent hide={isLoading}/>
				<div id="pcoded" className="pcoded">
					<HeaderComponent user={user} />
				
					<div className="pcoded-main-container">
						<div className="pcoded-wrapper">
							<div className="pcoded-content">
								<div className="pcoded-inner-content">

									<div className="main-body">
										<div className="page-wrapper">
											<div className="page-header">
												<div className="page-header-title">
													<h4>Dashboard</h4>
												</div>
												<div className="page-header-breadcrumb">
													<ul className="breadcrumb-title">
														<li className="breadcrumb-item">
															<a href="#!">
																<i className="icofont icofont-home"></i>
															</a>
														</li>
														<li className="breadcrumb-item"><a href="#!">Dashboard</a>
														</li>
													</ul>
												</div>
											</div>
											<div className="page-body">
												<div className="row">

													{
														this.state.program.map((program, idx) => {
															return (
																<div key={idx} className="col-md-12 col-lg-4">
																	<a href="#" onClick={this.startQuestion.bind(this, program.program_id)}>
																		<div className={`card table-card ${idx%2 == 0 ? 'widget-success-card' : 'widget-primary-card'}`}>
																			<div className="row-table">
																				<div className="col-sm-3 card-block-big">
																					<i className="icofont icofont-trophy-alt"></i>
																				</div>
																				<div className="col-sm-9">
																					<h4>{program.program_name}</h4>
																					<h6>{program.question}</h6>
																				</div>
																			</div>
																		</div>
																	</a>
																</div>
															)
														})
													}

												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	
	}
}
export default Dashboard;
