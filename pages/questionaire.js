import LoadComponent from '../components/loader';
import HeaderComponent from '../components/header';
import NavComponent from '../components/nav';
import ThankYouComponent from '../components/thankYou';
import axios from 'axios';
import {getCookies, setCookies, removeCookie} from "../utils/cookies";
import {playBeep} from "../utils/sound";
import {notify} from "../utils/notification";
import objectAssign from 'object-assign';

import React, { Component } from "react";
import moment from 'moment';

class Tutorial extends Component {
    constructor (props) {
        super(props);

        this.backendUrl = process.env.BACKEND_URL;
        
        this.baseUrl = process.env.BASE_URL;

        this.state = {
            program: [],
            user: {},
            isLoading: true,
            questions: [],
            timer: null,
            timeLeft: 0,
            submitted: false,
            page: 1,
            activeTutorial: null,
            drafts: {},
            answerHasSent: false
        }
    }

    componentDidMount () {
        let catchLog = decodeURIComponent(getCookies('PDCLOGID'));
        if(catchLog) {
            catchLog = JSON.parse(catchLog)
            axios.get(`${this.backendUrl}/user/${catchLog.u}`).then(res => {
                if(res.data) this.setState({user: res.data})

                if(!res.data.photo) {
                    window.location = 'before-start';
                }

                if(!res.data.is_tutorial_viewed) {
                    this.setState({activeTutorial: 1});
                }

                let drafts = getCookies('answer-draft') ? JSON.parse(getCookies('answer-draft')) : {};

                this.setState({drafts: drafts});

                let program = JSON.parse(decodeURIComponent(getCookies('PROG-ID')))

                if(program){
                    axios.get(`${this.backendUrl}/question/${program.id}`).then((res) => {
                        if(res.data) {
                            let questions = this.chunkArray(res.data, 10);
                            let totalQuestions = [];
                            questions.forEach((d, idx) => {
                                questions[idx].answered = [];
                                d.forEach((d2, idx2) => {
                                    questions[idx][idx2].answerId = null;

                                    if(drafts[d2.question_id]) {
                                        questions[idx].answered.push(d2.question_id);
                                        questions[idx][idx2].answerId = drafts[d2.question_id] || null;
                                    }

                                    if(d2.answer.length) totalQuestions[idx] = totalQuestions[idx] ? totalQuestions[idx] + 1 : 1;
                                });

                                questions[idx].totalQuestions = totalQuestions[idx] ? totalQuestions[idx] : 0;

                            })

                            this.setState({questions: questions, isLoading: false})
                            let duration = 60 * program.duration || 1;
                            this.startTimer(duration)
                        }
                    });
                } else {
                    this.setState({isLoading: false});
                    notify('Program not Found', 'inverse')
                }
            })
        }else {
            window.location.pathname = '/';
        }
    }

    nextTutorial () {
        let activeTutorial = this.state.activeTutorial + 1

        this.setState({activeTutorial: activeTutorial})

        setTimeout(() => {
            var scrollTo = $('.tutorial-'+activeTutorial);
            if(scrollTo) {
                $('html, body').animate({
                    scrollTop: ($(scrollTo).offset().top) - 100
                },500);
            }
        }, 100)
    }

    gotIt () {
        axios.post(`${this.backendUrl}/set_tutorial_active`, {
            applicant_id : this.state.user.applicant_id,
            status: 1,
            date: moment().format('YYYY-MM-DD H:m:s')
        }).then((res) => {
            if(res.status == 200) {
                this.setState({activeTutorial: null})
            }
        })
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

        let {questions, drafts} = this.state;
        let totalAnswered = 0; let totalQuestion = 0;
        let payload = [];
        
        questions.forEach((q, k) => {
            totalQuestion = q.totalQuestions + totalQuestion;
            q.forEach((data, i) => {
                if(data.answer.length) {
                    if(drafts[data.question_id]) payload.push(drafts[data.question_id]);
                    else console.log(data);
                }
            })
        });

console.log("questions", questions);

console.log("Object.keys(drafts).length", Object.keys(drafts).length);

console.log("totalQuestion", totalQuestion);

console.log("payload", payload);
        if(totalQuestion == payload.length) {
            axios.post(`${this.backendUrl}/answer`, {
                data : payload,
                applicantId : this.state.user.applicant_id,
                applicantProgramId : this.state.user.applicant_program_id,
                selectedTime: moment().format('YYYY-MM-DD H:m:s')
            }).then(() => {
                this.setState({answerHasSent: true});
                removeCookie('answer-draft');
            })
        }
    }

    setAnswer(aId, qId, qIdx, tId) {
        var drafts = this.state.drafts;
        drafts[qId] = aId;
        // drafts.push(draft);

        this.setState({drafts : drafts});

        // console.log('this.state.draft', this.state.drafts);

        setCookies('answer-draft', JSON.stringify(this.state.drafts));

        axios.post(`${this.backendUrl}/answer-history`, {
            answer_id : aId,
            applicant_program_id : this.state.user.applicant_program_id,
            selected_time: moment().format('YYYY-MM-DD H:m:s')
        }).then(() => {
            var a = this.state.questions;

            if(!a[tId][qIdx].answerId) {
                a[tId][qIdx].answerId = aId;
                a[tId].answered.push(qId)
                this.setState({questions: a});
            }
            console.log('====> programId: ' + getCookies('PROG-ID') + ' answerId: ' + aId + ' Selected')
        })
    }

    startTimer(duration) {
        var start = Date.now(),
            timeLeft = 1,
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
            timeLeft = parseInt(totalSeconds/60); //check with minutes
            timeLeft = totalSeconds; //check with seconds

            if(timeLeft >= this.state.timeLeft + 10) {
                this.setState({timeLeft : timeLeft})
                notify(timeLeft + ' detik telah berakhir', 'inverse');
                console.log('alert notify ', timeLeft);
            }

            if (diff <= 10) {
                playBeep();
                
                if(diff <= 0) {
                    clearInterval(x); 
                    notify('Waktu Berakhir', 'inverse');
                }
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

    render () {
        const {user, isLoading, drafts} = this.state;
        
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
                                        {(() => {
                                            if(this.state.answerHasSent) {
                                                return (
                                                    <ThankYouComponent />
                                                )
                                            } else {
                                                return (
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
                                                                {(() => {
                                                                    if (this.state.activeTutorial == 1) {
                                                                        return (
                                                                            <div className="tutorial tutorial-1">
                                                                                <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                        <label className="badge badge-warning">Tutorial 1</label><br></br>
                                                                                        Tes terdiri dari beberapa halaman, 
                                                                                        dan setiap halaman terdiri dari 10 soal. 
                                                                                        Peserta harus menjawab semua soal yang diberikan sesuai waktu yang telah ditetapkan
                                                                                        <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    } else if (this.state.activeTutorial == 5) {
                                                                        return (
                                                                            <div className="tutorial tutorial-5">
                                                                                <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                        <label className="badge badge-warning">Tutorial 5</label><br></br>
                                                                                        Lanjutkan mengisi jawaban sampai halaman terahkir dari soal
                                                                                        <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    } else if (this.state.activeTutorial == 7) {
                                                                        return (
                                                                            <div className="tutorial tutorial-7">
                                                                                <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                        <label className="badge badge-warning">Tutorial 7</label><br></br>
                                                                                        System akan memberikan warning pada "tab" berwarna merah. Bila ada soal yang belum dijawab pada tab tersebut. Anda dapat klik pada "tab" halaman dan melihat soal yang masih merah (Belum dijawab)
                                                                                        <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    } else if (this.state.activeTutorial == 8) {
                                                                        return (
                                                                            <div className="tutorial tutorial-8">
                                                                                <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                        <label className="badge badge-warning">Tutorial 8</label><br></br>
                                                                                            Bila telah dijawab, anda dapat langsung ke "tab" terahkir untuk mengklik "Selesai" sekali lagi.
                                                                                        <br></br><label className="badge badge-success" onClick={this.gotIt.bind(this)}>Saya mengerti </label>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })()}
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-sm-12">
                                                                    <div className="card">
                                                                        <div className="card-header">
                                                                            <h5 style={{textTransform:'none'}}>Pilih jawaban anda dengan klik salah satu skala angka 0-4</h5>
                                                                            
                                                                            {
                                                                                this.state.activeTutorial == 3 ?
                                                                                (
                                                                                    <div className="tutorial tutorial-3">
                                                                                        <span className="tooltip-content">
                                                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                                <label className="badge badge-warning">Tutorial 3</label><br></br>
                                                                                                Jawaban anda akan terekam disebelah kiri layar, lanjutkan mengisi jawaban pada halaman terserbut.
                                                                                                Pastikan mengerjakan soal yang menurut anda lebih mudah terlebih dahulu.<br></br>
                                                                                                
                                                                                                <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                            </span>
                                                                                        </span>
                                                                                    </div>
                                                                                ) : null
                                                                            }
                                                                           
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
                                                                                                            {this.state.submitted && tab.answered.length != tab.totalQuestions ? (<label className="badge badge-danger" style={{marginBottom:'0px'}}>!</label>) : null}
                                                                                                        </a>
                                                                                                    </li>
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                    <div className="tab-content tabs">
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
                                                                                                                            <tr key={'tr-'+qIdx} style={!drafts[res.question_id] && this.state.submitted ? {backgroundColor: '#f2dede'} : {backgroundColor: 'white'}}>
                                                                                                                                <th scope="row">{(this.state.page - 1)*10 +qIdx+1}</th> 
                                                                                                                                <td style={{whiteSpace:'normal'}}>  
                                                                                                                                    <p>{res.question_detail}</p> 
                                                                                                                                </td>
                                                                                                                                <td>
                                                                                                                                    {
                                                                                                                                        this.state.activeTutorial == 2 ?
                                                                                                                                        (
                                                                                                                                            <div className="tutorial tutorial-2">
                                                                                                                                                <span className="tooltip-content">
                                                                                                                                                    <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                                                                                        <label className="badge badge-warning">Tutorial 2</label><br></br>
                                                                                                                                                        Pilih jawaban anda dengan klik salah satu skala angka 0 - 4<br></br>
                                                                                                                                                        ( 0 = Sangat tidak setuju | 1 = Tidak setuju | 2 = Ragu-ragu | 3 = Setuju | 4 =  Sangat setuju)
                                                                                                                                                        <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                                                                                    </span>
                                                                                                                                                </span>
                                                                                                                                            </div> 
                                                                                                                                        ) : null 
                                                                                                                                    }
                                                                                                                                     
                                                                                                                                    {
                                                                                                                                        res.answer.map((ans, aIdx)=>{

                                                                                                                                            return (
                                                                                                                                                <div style={{display: 'inline-block'}} key={'q-'+aIdx}>
                                                                                                                                                    <input 
                                                                                                                                                        defaultChecked={drafts[res.question_id] === ans.answer_id} 
                                                                                                                                                        onChange={this.setAnswer.bind(this, ans.answer_id, res.question_id, qIdx, tIdx)} 
                                                                                                                                                        name={`answer-${res.question_id}`} 
                                                                                                                                                        style={{marginTop: '4px'}} 
                                                                                                                                                        type="radio"
                                                                                                                                                    />
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
                                                                                                            {this.state.submitted && tab.answered.length != tab.totalQuestions ? (<label className="badge badge-danger" style={{marginBottom:'0px'}}>!</label>) : null}
                                                                                                        </a>
                                                                                                    </li>
                                                                                                );
                                                                                            })
                                                                                        }

                                                                                        {(() => {
                                                                                            if(this.state.activeTutorial == 4) {
                                                                                                return (
                                                                                                    <div className="tutorial tutorial-4">
                                                                                                        <span className="tooltip-content">
                                                                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                                                <label className="badge badge-warning">Tutorial 4</label><br></br>
                                                                                                                Pada ahkir setiap halaman, klik "Berikutnya" untuk lanjut ke halaman berikut nya<br></br>
                                                                                                                atau "Sebelumnya" untuk kembali ke halaman sebelumnya. Atau anda bisa langsung klik tab nomor
                                                                                                                yang ada di atas soal.
                                                                                                                
                                                                                                                <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                );
                                                                                            } else if(this.state.activeTutorial == 6) {
                                                                                                return (
                                                                                                    <div className="tutorial tutorial-6">
                                                                                                        <span className="tooltip-content-1" style={{color:"white", display:'block',background: '#2b2b2b',padding: '15px'}}>
                                                                                                            <span className="tooltip-text" style={{ width:'100%',display:'block'}}>
                                                                                                                <label className="badge badge-warning">Tutorial 6</label><br></br>
                                                                                                                Klik "Selesai" bila seluruh soal telah dikerjakan
                                                                                                                <br></br><label className="badge badge-success" onClick={this.nextTutorial.bind(this)}>Selanjutnya ></label>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        })()}
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
                                                );
                                            }
                                        })()}
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
