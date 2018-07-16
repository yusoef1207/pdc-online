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
		return (
			<div className="page-wrapper">
                <div className="page-header">
                </div>
                <div className="page-body">
                    <div className="row">
                    
                        <div className="col-md-6 offset-md-3">
                            <div className="card-block inverse-breadcrumb" style={{marginTop:'80px'}}>
                                <h5 style={{textAlign:'center',lineHeight:'25px;'}}>Terima Kasih telah mengikuti Test ini. Silahkan Klik finish untuk menutup Program</h5>
                                <br></br>
                                <a className="btn btn-success" style={{margin:'auto',display:'block',width:'50%'}} onClick={this.logout.bind(this)}>
                                     Finish
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
		);
	}
}

export default Navigation;