const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin123456',
    database: 'oms',
    namedPlaceholders: true, // 这个配置的作用是启用命名占位符功能。
    connectionLimit: 10, // 连接池的最大连接数
    waitForConnections: true, // 当连接池已满时，是否等待连接可用
    queueLimit: 10 // 连接池的最大等待队列长度
})

pool.query("select * from tags where id=?", [1], (err, results, fields) => {
    if (err) {
        console.error('Error connecting' + err.stack);
    }
    console.log('results', results);
    console.log('fields', fields);
})