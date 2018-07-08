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
	            res.json(results[0]);
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

module.exports = router;  