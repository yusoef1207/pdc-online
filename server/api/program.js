var express = require('express');  
var router = express.Router();  
var Program = require('./model/program');  

router.get('/program', function(req, res, next) {  
    Program.getAllProgram(function(err, results, fields) {
        if (err) {  
            res.json(err);  
        } else {  
            res.json(results);
        }  
    }); 
});

router.get('/program/:id', function(req, res, next) {  
	if(req.params.id) {
	    Program.getProgramById(req.params.id, function(err, results, fields) {
	        if (err) {  
	            res.json(err);  
	        } else {  
	            res.json(results[0]);
	        }  
	    }); 
	}else {
    	res.json({})
    }
});

router.post('/answer-history', function(req, res, next) {  
    Program.answerHistory(req.body, function(err, results, fields) {
        if (err) {  
            res.json(err);  
        } else {  
            res.json(results);
        }  
    }); 
});

router.post('/answer', function(req, res, next) {  
	if(req.body && req.body.data.length) {
		let data = req.body.data;
		let applicantId = req.body.applicantId;
		let applicantProgramId = req.body.applicantProgramId;
		let selectedTime = req.body.selectedTime;
		let values = [];

		data.forEach((answer, i) => {
			if (answer) {
				values.push([
					answer, 
					applicantId, 
					selectedTime,
					applicantProgramId
				]); 
			}
		})
	    
	    Program.answer(values, function(err, results, fields) {
	        if (err) {  
            	res.json(err);  
	        } else {  
	            res.json(results);
	        }
	    });
	} else {
		res.json({message: 'answer empty', status: 422})
	}
});

router.get('/question/:id', function(req, res, next) {  
    if(req.params.id) {
    	Program.getAllQuestion(req.params.id, function(err, results, fields) {
	        if (err) {  
	            res.json(err);  
	        } else {  
	        	let questions = [];
	        	let questionIds = null; let tempIds = [];
	        	results.forEach((d)=>{
	        		tempIds.push(d.question_id);
	        		questions.push(d);
	        	})

	        	questionIds = tempIds.join();

	        	Program.getAllAnswer(questionIds, function(e, answer, f) {
	        		let pqMap = []
	        		questions.forEach((q,idx) => {
	        			pqMap.push(q);
	        			pqMap[idx].answer = [];
	        			answer.forEach((a) => {
	        				if(q.question_id == a.question_id) {
	        					pqMap[idx].answer.push(a);
	        				}
	        			})
	        		})
	        		
	            	res.json(pqMap);
	        	})
	        }  
	    }); 
    }else {
    	res.json({})
    }
});

module.exports = router;  