import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import axios from 'axios';
import {getCookies} from "../utils/cookies";
import {imageUpload} from "../utils/image-upload";

import React, { Component } from "react";
import Webcam from 'react-webcam';

class Start extends Component {
	constructor (props) {
		super(props);
		this.webcam = null;
		this.state = {
			program: [],
			user: {},
			screenshot: null,
			isLoading: true
		}

		this.logCookie = null;

		this.capture = this.capture.bind(this);
	}

	componentDidMount () {
		this.logCookie = JSON.parse(decodeURIComponent(getCookies('PDCLOGID')))
		if(this.logCookie) {
			axios.get(`http://178.128.26.210:4000/user/${this.logCookie.u}`).then(res => {
				if(res.data) this.setState({user: res.data, isLoading: false})
			})
		}else {
			window.location.pathname = '/';
		}
	}

	deletePhoto () {
        this.setState({ screenshot: null });
	}

	capture () {
        const screenshot = this.refs.webcam.getScreenshot();
        this.setState({ screenshot });
	}

	startTest () {
		var img = this.state.screenshot.split('base64,')[1];

		if(img) {
			imageUpload(img).then((res)=>{
				if(res.data.data) {
					axios.post(`http://178.128.26.210:4000/add_photo`, {
						applicant_id: this.state.user.applicant_id,
						client_id: this.state.user.client_id,
						login_time: this.logCookie.t,
						photo: res.data.data.link
					}).then((res) => {
						if(res.data) {
							window.location.pathname = '/tutorial';
						}
					});
				}
			});

		}
	}

	render () {
		const {user, isLoading} = this.state;
		const videoConstraints = {
			width: 1280,
			height: 720,
			facingMode: 'user',
		};

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
												<div className="page-header-title">
													<h4 style={{fontSize:'30px'}}>PT. Roosled Sinergi Minterindo</h4>
												</div>
												<div className="page-header-breadcrumb">
													<ul className="breadcrumb-title">
														<li className="breadcrumb-item">
															<a href="#!">
																<i className="icofont icofont-home"></i>
															</a>
														</li>
														<li className="breadcrumb-item">
															<a href="#!">Employment Personality Test</a>
														</li>
													</ul>
												</div>
											</div>
											
											<div className="page-body">

												<div className="card-block inverse-breadcrumb">

												<h6 style={{textAlign:'center'}}>Waktu tes akan memberikan "warning" dengan suara dan font yang lebih besar setiap 10 menit <br/><br/>
												Akan terdengar bunyi "bip" bila waktu tersisa 10 detik. sistem akan otomatis menutup Test apabila waktu telah habis.<br/><br/>
												Waktu akan mulai dihitung saat Online Psikotest ini dimulai. <br/><br/>
												Selamat Mengerjakan<br/><br/>

												<div className="camera">
													{
														this.state.screenshot ? 
														<img src={this.state.screenshot} /> : 
														<Webcam audio={false} ref='webcam' width={350} height={350} screenshotFormat="image/jpeg"/>
													}
													<div className="controls visible">
														<a href="#" id="delete-photo" title="Delete Photo" onClick={this.deletePhoto.bind(this)}><i className="material-icons">delete</i></a>
														<a href="#" id="take-photo" title="Take Photo" onClick={this.capture}><i className="material-icons">camera_alt</i></a>
													</div>
												</div>

												{
													this.state.screenshot ? 
													<a href="#" onClick={this.startTest.bind(this)} className="btn btn-success">Mulai Test!</a> :
													<div className="btn btn-danger">Mulai Test!</div>
												}
												</h6>

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


export default Start;
