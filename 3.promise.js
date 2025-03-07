const mysql = require('mysql2/promise');
async function query() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123456',
        database: 'oms'
    });
    try {
        const [results, fields] = await connection.query("select * from tags where id=?", [1]);
        console.log('results', results);
        console.log('fields', fields);
    } catch (error) {
        console.error(error);
    }
}
query().catch(console.error).finally(() => process.exit(0))