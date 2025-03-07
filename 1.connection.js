const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123456',
    database: 'oms'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting' + err.stack);
    }
    console.log('Connected successfully');
});