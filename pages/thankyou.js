import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import axios from 'axios';
import {getCookies, setCookies} from "../utils/cookies";
import React, { Component } from "react";

class Dashboard extends Component {
	constructor (props) {
		super(props);

		this.state = {
			program: [],
			user: {},
			isLoading: true
		}
	}

	componentDidMount () {
		if(getCookies('PDCLOGID')) {
			axios.get('http://178.128.26.210:4000/program').then((res) => {
				if(res.data) this.setState({program: res.data})
			})
			var catchLog = JSON.parse(decodeURIComponent(getCookies('PDCLOGID')));

			axios.get(`http://178.128.26.210:4000/user/${catchLog.u}`).then(res => {
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
    
    logout () {
		removeCookie('PDCLOGID');
		removeCookie('PROG-ID');
		window.location.pathname = '/';
	}

	render () {
        const {user, isLoading} = this.state;

		return (
			<div>
				<LoadComponent />
				<div id="pcoded" className="pcoded">
					<HeaderComponent user={user} />
				
					<div className="pcoded-main-container">
						<div className="pcoded-wrapper">
							<div className="pcoded-content">
								<div className="pcoded-inner-content">

									<div className="main-body">
										<div className="page-wrapper">
											<div className="page-header">
											</div>
											<div className="page-body">
												<div className="row">
                                                
													<div class="col-md-6 offset-md-3">
                                                        <div className="card-block inverse-breadcrumb" style={{marginTop:'80px'}}>
                                                            <h5 style={{textAlign:'center',lineHeight:'25px;'}}>Terima Kasih telah mengikuti Test ini. Silahkan Klik finish untuk menutup Program</h5>
                                                            <br></br>
                                                            <a  class="btn btn-success" style={{margin:'auto',display:'block',width:'50%'}} onClick={this.logout.bind(this)}>
                                                                 Finish
                                                            </a>
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
				</div>
			</div>
		);
	
	}
}
export default Dashboard;
