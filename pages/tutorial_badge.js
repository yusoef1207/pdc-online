import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';

import React, { Component } from "react";
import moment from 'moment';



class TutorialBadge extends Component{


    render(){

        return(
            <div>
                <LoadComponent />

                <div id="pcoded" className="pcoded">
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
														<li className="breadcrumb-item"><a href="#!">Tutorial</a>
														</li>
													</ul>
												</div>
											</div>
                                            
											<div className="page-body">
												<div className="row">

											
                                                    <div class="col-sm-9">
                                                        
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
        )
    }
}

export default TutorialBadge;