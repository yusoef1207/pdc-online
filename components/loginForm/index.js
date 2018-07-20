import React, { Component } from "react";
// import "./style.scss";
import {setCookies} from "../../utils/cookies";
import {notify} from "../../utils/notification";
import axios from 'axios';
import moment from 'moment';

class Login extends Component {
	constructor (props) {
		super(props);
		this.backendUrl = process.env.BACKEND_URL;
		this.state = {
			email: null,
			password: null,
			emailInvalid: false,
			submitted: false,
			isLoading: false,
			program: null
		}
	
	}

	componentDidMount() {
		var email = this.getParameterByName('email');
		if(email) {
			var program = this.getParameterByName('program');
			$('[name="email"]').val(email);
			this.setState({email : email, program: program});
		}
	}

	getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	fill(name) {
		if(name == 'email') this.setState({email : $('[name="email"]').val()})
		else this.setState({password : $('[name="password"]').val()})
	}

	authenticate () {
		this.setState({submitted: true});
		if($('[name="email"]').val() && $('[name="password"]').val()) {
			this.setState({isLoading: true})
			const url = `${this.backendUrl}/login`;
			axios.post(url, {
				email: $('[name="email"]').val(),
				password: $('[name="password"]').val()
			}).then((res) => {
				if(res.data) {
					
					if(this.state.program) {
						
						axios.get(`${this.backendUrl}/program/${this.state.program}`).then((program) => {
							if(program.data) {
								
								setCookies('PDCLOGID', encodeURIComponent(JSON.stringify({u:res.data.applicant_id,t:moment().format('YYYY-MM-DD H:m:s')})));
								setCookies('PROG-ID', encodeURIComponent(JSON.stringify({id:program.data.program_id,duration:program.data.duration})));
								window.location.replace('/before-start');
							
							} else {
								notify('Program tidak ditemukan', 'danger');
								this.setState({isLoading: false});
							}
						});

					} else {

						setCookies('PDCLOGID', encodeURIComponent(JSON.stringify({u:res.data.applicant_id,t:moment().format('YYYY-MM-DD H:m:s')})));
						window.location.replace('/dashboard');
					
					}

				} else {
					notify('User tidak ditemukan', 'danger');
					this.setState({emailInvalid : true, isLoading: false});
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
											<input type="email" onChange={this.fill.bind(this, 'email')} className={`form-control${this.state.submitted && (this.state.emailInvalid || !this.state.email) ? ' form-control-danger' : ''}`} placeholder="Username" name="email"/>
											<span className="md-line"></span>
										</div>
										<div className="input-group">
											<input type="password" onChange={this.fill.bind(this, 'password')} className={`form-control${this.state.submitted && (this.state.emailInvalid || !this.state.password) ? ' form-control-danger' : ''}`} placeholder="password" name="password" autoComplete="true"/>
											<span className="md-line"></span>
										</div>

										<div className="row m-t-30">
											<div className="col-md-12">
											{
												this.state.isLoading ? 
												(
													<a className={`btn btn-default btn-md btn-block waves-effect text-center m-b-20`}>LOGIN</a>
												) : 
												(
													<a onClick={this.authenticate.bind(this)} className={`btn btn-primary btn-md btn-block waves-effect text-center m-b-20`}>LOGIN</a>
												) 
											
											}
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
