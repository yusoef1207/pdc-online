var db = require('../../db');
var User = {
    authenticate: function(body, callback) {  
        return db.query("Select * from tapplicant where email=? and password=?", [body.email, body.password], callback);  
    },
    getById: function(id, callback) {  
        return db.query(`Select 
            ta.*, tap.applicant_program_id, tah.photo, tah.login_time
            from tapplicant ta 
            left join tapplicantprogram tap on tap.applicant_id = ta.applicant_id 
            inner join tapplicanthistory tah on tah.applicant_id = ta.applicant_id
            where ta.applicant_id=?`, [id], callback);  
    },
    addPhoto: function(data, callback) {  
        db.query("Insert into tapplicanthistory (applicant_id, client_id, login_time, photo) values(?,?,?,?)", [data.applicant_id, data.client_id, data.login_time, data.photo], function(err, res, field) {
        	return db.query("Select * from tapplicanthistory where applicant_id=? and login_time=?", [data.applicant_id, data.login_time], callback);
        });
    },
};  
module.exports = User; 