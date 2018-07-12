import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import axios from 'axios';
import {getCookies} from "../utils/cookies";
import {playBeep} from "../utils/sound";
import objectAssign from 'object-assign';

import React, { Component } from "react";
import moment from 'moment';

class Tutorial extends Component {
    constructor (props) {
        super(props);

        this.countDownTime = 60 * 0.1;

        this.state = {
            program: [],
            user: {},
            isLoading: true,
            questions: [],
            timer: null,
            notify: 0,
            submitted: false,
            page: 1
        }
    }

    setPage (qId) {
        this.setState({page: qId})
    }

    nextPage () {
        let next = this.state.page;
        next =  (next == this.state.questions.length) ? next : ++next;

        this.setPage(next);
    }

    prevPage () {

        let page = this.state.page;
        let prev = page == 0 ? 0 : page -1;

        this.setPage(prev);
    }

    submitAnswer () {
        this.setState({submitted: true})

        let questions = this.state.questions;
        let totalAnswered = 0; let totalQuestion = 0;
        let payload = [];
        
        questions.forEach((q, k) => {
            totalQuestion = q.totalQuestions + totalQuestion;
            totalAnswered = q.totalAnswered + totalAnswered;
            q.forEach((data, i) => {
                if(data.answerId) payload.push(data.answerId);
            })
        });

        if(totalQuestion == totalAnswered) {
            axios.post('http://178.128.26.210:4000/answer', {
                data : payload,
                applicantId : this.state.user.applicant_id,
                selectedTime: moment().format('YYYY-MM-DD H:m:s')
            }).then(() => {
                window.location.reload();
            })
        }
    }

    setAnswer(aId, qId, tId) {
        axios.post('http://178.128.26.210:4000/answer-history', {
            answer_id : aId,
            applicant_program_id : this.state.user.applicant_program_id,
            selected_time: moment().format('YYYY-MM-DD H:m:s')
        }).then(() => {
            var a = this.state.questions;

            if(!a[tId][qId].answerId) {
                a[tId][qId].answerId = aId;
                a[tId].totalAnswered = a[tId].totalAnswered + 1;
                this.setState({questions: a});
            }
            console.log('====> programId: ' + getCookies('PROG-ID') + ' answerId: ' + aId + ' Selected')
        })
    }

    startTimer(duration) {
        var start = Date.now(),
            notify = 1,
            totalSeconds = 0,
            diff,
            minutes,
            seconds;
       var x = setInterval(() => {
            diff = duration - (((Date.now() - start) / 1000) | 0);

            minutes = (diff / 60) | 0;
            seconds = (diff % 60) | 0;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.setState({timer: minutes + ":" + seconds}); 
            
            ++totalSeconds;
            notify = parseInt(totalSeconds/60); //check with minutes
            notify = totalSeconds; //check with seconds

            if(notify >= this.state.notify + 10) {
                this.setState({notify: notify});
                console.log('alert notify ', notify);
            }

            if (diff <= 0) {
                playBeep();
                console.warn('time is up!')
                clearInterval(x);
            }
        }, 1000);
    }

    chunkArray(myArray, chunk_size){
        let index = 0;
        let arrayLength = myArray.length;
        let tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }

        return tempArray;
    }

    componentDidMount () {
        let catchLog = JSON.parse(decodeURIComponent(getCookies('PDCLOGID')));
        if(catchLog) {
            axios.get(`http://178.128.26.210:4000/user/${catchLog.u}`).then(res => {
                if(res.data) this.setState({user: res.data, isLoading: false})

                if(!res.data.photo) {
                    window.location = 'before-start';
                }
            })

            axios.get(`http://178.128.26.210:4000/question/${getCookies('PROG-ID')}`).then((res) => {
                if(res.data) {
                    let questions = this.chunkArray(res.data, 10);
                    let totalQuestions = [];
                    questions.forEach((d, idx) => {
                        d.totalAnswered = 0;
                        
                        d.forEach((d2) => {
                            d2.answerId = null;
                            if(d2.answer.length) totalQuestions[idx] = totalQuestions[idx] ? totalQuestions[idx] + 1 : 1;
                        });

                        d.totalQuestions = totalQuestions[idx] ? totalQuestions[idx] : 0;

                    })

                    this.setState({questions: questions})

                    this.startTimer(this.countDownTime)
                }
            });
        }else {
            window.location.pathname = '/';
        }
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
                                        <div className="page-wrapper p-0">
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
                                                        <li className="breadcrumb-item"><a href="#!">Employment Personality Test</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="page-body">
                                                <div className="row" style={{ marginBottom:'20px'}}>
                                                    
                                                    <div className="tutorial tutorial-1">
                                                        <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                <label className="badge badge-warning">Tutorial 1</label><br></br>
                                                                Tes terdiri dari beberapa halaman, 
                                                                dan setiap halaman terdiri dari 10 soal. 
                                                                Peserta harus menjawab semua soal yang diberikan sesuai waktu yang telah ditetapkan
                                                                <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="tutorial tutorial-5">
                                                        <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                <label className="badge badge-warning">Tutorial 5</label><br></br>
                                                                Lanjutkan mengisi jawaban sampai halaman terahkir dari soal
                                                                <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="tutorial tutorial-7">
                                                        <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                <label className="badge badge-warning">Tutorial 7</label><br></br>
                                                                System akan memberikan warning pada "tab" berwarna merah. Bila ada soal yang belum dijawab pada tab tersebut. Anda dapat klik pada "tab" halaman dan melihat soal yang masih merah (Belum dijawab)
                                                                <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="tutorial tutorial-8">
                                                        <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                <label className="badge badge-warning">Tutorial 8</label><br></br>
                                                                    Bila telah dijawab, anda dapat langsung ke "tab" terahkir untuk mengklik "Selesai" sekali lagi.
                                                                <br></br><label className="badge badge-success">Saya mengerti </label>
                                                            </span>
                                                        </span>
                                                    </div>

                                                </div>

                                                    

                                                    

                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h5 style={{textTransform:'none'}}>Pilih jawaban anda dengan klik salah satu skala angka 0-4</h5>
                                                                
                                                                <div className="tutorial tutorial-3">
                                                                    <span className="tooltip-content">
                                                                        <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                            <label className="badge badge-warning">Tutorial 3</label><br></br>
                                                                            Jawaban anda akan terekam disebelah kiri layar, lanjutkan mengisi jawaban pada halaman terserbut.
                                                                            Pastikan mengerjakan soal yang menurut anda lebih mudah terlebih dahulu.<br></br>
                                                                            
                                                                            <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                                        </span>
                                                                    </span>
                                                                </div>

                                                                <span>
                                                                    <div style={{margin: '0px', fontSize: '14px'}} className="label-main">
                                                                            <label className="label label-info">0 = Sangat tidak setuju</label>
                                                                    </div>
                                                                    <div style={{margin: '0px', fontSize: '14px'}} className="label-main">
                                                                            <label className="label label-info">1 = Tidak setuju </label>
                                                                    </div>
                                                                    <div style={{margin: '0px', fontSize: '14px'}} className="label-main">
                                                                            <label className="label label-info">2 = Ragu-ragu </label>
                                                                    </div>
                                                                    <div style={{margin: '0px', fontSize: '14px'}} className="label-main">
                                                                            <label className="label label-info">3 = Setuju</label>
                                                                    </div>
                                                                    <div style={{margin: '0px', fontSize: '14px'}} className="label-main">
                                                                            <label className="label label-info">4 =  Sangat setuju</label>
                                                                    </div>
                                                                </span>
                                                                <div className="card-header-right">
                                                                    <i className="icofont icofont-rounded-down"></i>
                                                                </div>
                                                            </div>
                                                            <div className="card-block">
                                                                <div className="row">
                                                                    <div className="col-lg-12 col-lg-12">
                                                                        <div className="sub-title">Waktu Test : 
                                                                                <label style={{fontSize: '15px'}} className="badge badge-inverse-success">{this.state.timer}</label>
                                                                                <span style={{display:'inline-block', textAlign:'right', float:'right'}}>
                                                                                    <label style={{fontSize: '15px'}} className="badge badge-inverse-danger">Mohon dilengkapi semua pertanyaan</label>
                                                                                </span>
                                                                        </div>                                        
                                                                        <ul className="nav nav-tabs tabs" role="tablist" style={{overflowY:'hidden'}}>
                                                                            
                                                                            {
                                                                                this.state.questions.map((tab, idx) => {
                                                                                    return (
                                                                                        <li key={idx} className="nav-item">
                                                                                            <a onClick={this.setPage.bind(this, idx + 1)} className={`nav-link ${this.state.page == (idx + 1) ? 'active' : ''}`} data-toggle="tab" href={`#questions-${idx}`} role="tab">
                                                                                                {idx * 10 + 1} - {(idx + 1) * 10}
                                                                                                {this.state.submitted && tab.totalQuestions != tab.totalAnswered ? (<label className="badge badge-danger" style={{marginBottom:'0px'}}>!</label>) : null}
                                                                                            </a>
                                                                                        </li>
                                                                                    );
                                                                                })
                                                                            }
                                                                            
                                                                        </ul>
                                                                        <div className="tab-content tabs card-block">
                                                                            {
                                                                                this.state.questions.map((tab, tIdx) => {

                                                                                    return (
                                                                                        <div key={tIdx} className={`tab-pane ${this.state.page == (tIdx + 1) ? 'active' : ''}`} id={`questions-${tIdx+1}`} role="tabpanel">
                                                                                            <div className="table-responsive">
                                                                                                <table className="table table-hover">
                                                                                                    <thead>
                                                                                                        <tr>
                                                                                                            <th width="10%">#</th>
                                                                                                            <th width="50%">Question</th>
                                                                                                            <th width="60%">Your Oppinion</th>
                                                                                                        </tr>
                                                                                                    </thead>   
                                                                                                    <tbody id="row">

                                                                                                    {
                                                                                                        tab.map((res, qIdx) => {
                                                                                                            return (
                                                                                                                <tr key={qIdx} style={!res.answerId && this.state.submitted ? {backgroundColor: '#f2dede'} : {backgroundColor: 'white'}}>
                                                                                                                    <th scope="row">{qIdx+1}</th> 
                                                                                                                    <td style={{whiteSpace:'normal'}}>  
                                                                                                                        <p>{res.question_detail}</p> 
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <div className="tutorial tutorial-2">
                                                                                                                            <span className="tooltip-content">
                                                                                                                                <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                                                                    <label className="badge badge-warning">Tutorial 2</label><br></br>
                                                                                                                                    Pilih jawaban anda dengan klik salah satu skala angka 0 - 4<br></br>
                                                                                                                                    ( 0 = Sangat tidak setuju | 1 = Tidak setuju | 2 = Ragu-ragu | 3 = Setuju | 4 =  Sangat setuju)
                                                                                                                                    <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                                                                                                </span>
                                                                                                                            </span>
                                                                                                                        </div>  
                                                                                                                        {
                                                                                                                            res.answer.map((ans, aIdx)=>{
                                                                                                                                return (
                                                                                                                                    <div style={{display: 'inline-block'}} key={aIdx}>
                                                                                                                                        <input onClick={this.setAnswer.bind(this, ans.answer_id, qIdx, tIdx)} name={`answer-${qIdx}`} style={{marginTop: '4px'}} type="radio"/>
                                                                                                                                        <label style={{margin: '0 5px 0px 5px'}}>{ans.answer_detail}</label>
                                                                                                                                    </div>
                                                                                                                                );
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </td> 
                                                                                                                </tr>
                                                                                                            );
                                                                                                        })
                                                                                                    }
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>

                                                                        <ul className="nav nav-tabs tab-below tabs" role="tablist">
                                                                            {
                                                                                this.state.questions.map((tab, idx) => {
                                                                                    return (
                                                                                        <li key={idx} className="nav-item">
                                                                                            <a onClick={this.setPage.bind(this, idx + 1)} className={`nav-link ${this.state.page == (idx + 1) ? 'active' : ''}`} data-toggle="tab" href={`#questions-${idx+1}`} role="tab">
                                                                                                {idx * 10 + 1} - {(idx + 1) * 10}
                                                                                                {this.state.submitted && tab.totalQuestions != tab.totalAnswered ? (<label className="badge badge-danger" style={{marginBottom:'0px'}}>!</label>) : null}
                                                                                            </a>
                                                                                        </li>
                                                                                    );
                                                                                })
                                                                            }
                                                                            <div className="tutorial tutorial-4">
                                                                                <span className="tooltip-content">
                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                        <label className="badge badge-warning">Tutorial 4</label><br></br>
                                                                                        Pada ahkir setiap halaman, klik "Berikutnya" untuk lanjut ke halaman berikut nya<br></br>
                                                                                        atau "Sebelumnya" untuk kembali ke halaman sebelumnya. Atau anda bisa langsung klik tab nomor
                                                                                        yang ada di atas soal.
                                                                                        
                                                                                        <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                                                    </span>
                                                                                </span>
                                                                            </div>

                                                                            <div className="tutorial tutorial-6">
                                                                                <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                        <label className="badge badge-warning">Tutorial 6</label><br></br>
                                                                                        Klik "Selesai" bila seluruh soal telah dikerjakan
                                                                                        <br></br><label className="badge badge-success">Selanjutnya ></label>
                                                                                    </span>
                                                                                </span>
                                                                            </div>


                                                                        </ul>
                                                                        <div className="row">
                                                                            <div className="col-md-6 offset-md-6" style={{textAlign:'right', fontSize:'17px'}}>
                                                                                <a onClick={this.prevPage.bind(this, this.state.prev)}>
                                                                                    <label className="label label-inverse-primary"><i className="ti-angle-double-left"></i> Sebelumnya</label>
                                                                                </a>
                                                                                <a onClick={this.nextPage.bind(this, this.state.next)}>
                                                                                    <label className="label label-inverse-primary">Berikutnya<i className="ti-angle-double-right"></i></label>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-md-6 offset-md-6" style={{textAlign:'right', fontSize:'17px'}}>
                                                                                <a className="btn btn-success" onClick={this.submitAnswer.bind(this)}>
                                                                                    Submit
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
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Tutorial;
