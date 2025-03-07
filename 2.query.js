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

// mysql2中支持两种查询模式 回调和promise
// 这是一个带参数的 SQL 查询，用于从 tags 表中选择 id 等于某个值的所有列  ? 是参数占位符，表示这个位置的值将由第二个参数提供
// select * from tags where id=1
// fields ：包含关于结果集中字段的信息（如字段名、类型等
connection.query("select * from tags where id=?", [1], (err, results, fields) => {
    if (err) {
        console.error('Error connecting' + err.stack);
    }
    console.log('results', results);
    console.log('fields', fields);
})