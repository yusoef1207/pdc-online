var express = require('express');  
var router = express.Router();  
var User = require('./model/user');  

router.post('/login', function(req, res, next) {  
    User.authenticate(req.body, function(err, results, fields) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(results[0]);
        }  
    });  
});

router.get('/user/:id?', function(req, res, next) { 
	if(req.params.id) {
		User.getById(req.params.id, function(err, results, fields) {  
	        if (err) {  
	            res.json(err);  
	        } else {  
                if(results[0]) {
                    User.getAnsweredProgram(req.params.id, function(err, ans, fields) {
                        var user = results[0];                        
                        user.answeredQuestions = [];
                        if (err) {  
                            res.json(err);  
                        }else {
                            user.answeredQuestions = ans;
                        }

                        res.json(user);
                    })
                }
	            // res.json(results[0]);
	        }  
	    });  
	} 
});

router.post('/add_photo', function(req, res, next) { 
	User.addPhoto(req.body, function(err, results, fields) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(results[0]);
        }  
    });  
});

router.post('/set_tutorial_active', function(req, res, next) { 
    User.setTutorial(req.body, function(err, results, fields) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(results[0]);
        }  
    });  
});



module.exports = router;  