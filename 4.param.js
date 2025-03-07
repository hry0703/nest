const mysql = require('mysql2/promise');
async function query() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123456',
        database: 'oms',
        namedPlaceholders: true // 这个配置的作用是启用命名占位符功能。
        //     具体来说：
        //     1. 当设置 namedPlaceholders: true 时，你可以在 SQL 查询中使用: 参数名 的形式来表示参数占位符，而不是使用问号? 。
        //     2. 然后在执行查询时，你可以传递一个对象，其中属性名与占位符名称对应，如代码中的 { id } 。
        //     3. 这种方式比使用问号占位符更加直观和易于维护，特别是当 SQL 语句中有多个参数时。
        // :id 是命名占位符，它会被 { id } 对象中的 id 属性值（在这个例子中是 1）替换。
    });
    try {
        const id = 1;
        // 如果不使用命名占位符，同样的查询需要这样写：
        // const [results, fields] = await connection.query("select * from tags where id=?", [id]);
        const [results, fields] = await connection.query("select * from tags where id=:id", { id });
        console.log('results', results);
        console.log('fields', fields);
    } catch (error) {
        console.error(error);
    }
}
query().catch(console.error).finally(() => process.exit(0))