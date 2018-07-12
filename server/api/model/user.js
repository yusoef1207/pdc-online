var db = require('../../db');
var User = {
    authenticate: function(body, callback) {  
        return db.query("Select * from tapplicant where email=? and password=?", [body.email, body.password], callback);  
    },
    getById: function(id, callback) {  
        return db.query(`Select 
            ta.*, tap.applicant_program_id, tah.photo, tah.login_time, tat.status as is_tutorial_viewed
            from tapplicant ta 
            left join tapplicantprogram tap on tap.applicant_id = ta.applicant_id 
            left join tapplicanthistory tah on tah.applicant_id = ta.applicant_id
            left join tapplicanttutorial tat on tat.applicant_id = ta.applicant_id
            where ta.applicant_id=?
            order by tah.login_time desc
            limit 1
        `, [id], callback);  
    },
    addPhoto: function(data, callback) {  
        db.query("Insert into tapplicanthistory (applicant_id, client_id, login_time, photo) values(?,?,?,?)", [data.applicant_id, data.client_id, data.login_time, data.photo], function(err, res, field) {
            if (err) {  
                return err 
            } else {  
                return db.query("Select * from tapplicanthistory where applicant_id=? and login_time=?", [data.applicant_id, data.login_time], callback);
            }  
        });
    },
    setTutorial: function(data, callback) {
        db.query("Insert into tapplicanttutorial (applicant_id, status, date) values(?,?,?)", [data.applicant_id, data.status, data.date], callback);
    }
};  
module.exports = User; 