import React, { Component } from "react";
// import "./style.scss";
import {setCookies} from "../../utils/cookies";
import axios from 'axios';
import moment from 'moment';

class Login extends Component {
	constructor (props) {
		super(props);

		this.state = {
			email: null,
			password: null
		}
	
	}

	authenticate () {
		if($('[name="email"]').val() && $('[name="password"]').val()) {
			const url = `http://localhost:4000/login`;
			axios.post(url, {
				email: $('[name="email"]').val(),
				password: $('[name="password"]').val()
			}).then((res) => {
				if(res.data) {
					setCookies('PDCLOGID', encodeURIComponent(JSON.stringify({u:res.data.applicant_id,t:moment().format('YYYY-MM-DD H:m:s')})));
					window.location.pathname = '/dashboard';
				}
			});
		}	
	}

	render () {
		return (
			<section className="login p-fixed d-flex text-center bg-primary common-img-bg">

				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12">
							<div className="login-card card-block auth-body">
								<form className="md-float-material" >
									<div className="auth-box">
										<div className="row m-b-20">
											<div className="col-md-12">
												<h3 className="text-center txt-primary">Sign In PDC Online Psikotest</h3>
											</div>
										</div>

										<div className="input-group">
											<input type="email" className="form-control" placeholder="Username" name="email"/>
											<span className="md-line"></span>
										</div>
										<div className="input-group">
											<input type="password" className="form-control" placeholder="password" name="password" autoComplete="true"/>
											<span className="md-line"></span>
										</div>

										<div className="row m-t-30">
											<div className="col-md-12">
												<a onClick={this.authenticate.bind(this)} className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20">LOGIN</a>
											</div>
										</div>

									</div>
								</form>
							</div>
						</div>
					</div>
				</div>

			</section>
		);
	}
}

export default Login;
