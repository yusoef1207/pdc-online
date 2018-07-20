var db = require('../../db');

var Program = {
    getAllProgram: function(callback) {  
        return db.query(`Select 
            tp.*, COUNT(tpq.question_id) as question 
            from tprogram tp 
            left join 
                tprogramquestion tpq on tpq.program_id = tp.program_id
            group by tp.program_id
        `, callback);  
    },
    getProgramById: function(programId, callback) {  
        return db.query(`Select 
        	tp.*
        	from tprogram tp 
        	where tp.program_id = ?
        `, [programId], callback);  
    },
    getAllQuestion: function(programId, callback) {  
        return db.query(`Select 
        	tq.*
        	from tprogramquestion tpq 
        	left join 
        		tquestion tq on tq.question_id = tpq.question_id
        	where tpq.program_id = ${programId}
        	and approval_status = 'Approved'
        `, callback);  
    },
    getAllAnswer: function(questionId, callback) {  
        return db.query(`Select 
        	ta.*
        	from tanswer ta 
        	where ta.question_id in (${questionId})
        `, callback);  
    },
    answerHistory : function (data, callback) {
        return  db.query("Insert into tanswerhistory (answer_id, applicant_program_id, selected_time) values(?,?,?)", [data.answer_id, data.applicant_program_id, data.selected_time], callback);
    },
    answer : function (data, callback) {
    	return  db.query("Insert into tappllicantanswer (answer_id, applicant_id, selected_time, applicant_program_id) values ?", [data], callback);
    }
};  
module.exports = Program; 