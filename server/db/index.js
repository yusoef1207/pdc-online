let mysql = require('mysql');  
let mysqlConfig = require('./config.json')
let connection = mysql.createPool({
    "user": "pdc_user",
    "host": "178.128.26.210",
    "password": "Asdf123",
    "database": "pdc_db",
    typeCast: function castField( field, useDefaultTypeCasting ) {
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            var bytes = field.buffer();
            return( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );

    }
}
);  

module.exports = connection