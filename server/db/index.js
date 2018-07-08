let mysql = require('mysql');  
let mysqlConfig = require('./config.json')
let connection = mysql.createPool(mysqlConfig);  

module.exports = connection