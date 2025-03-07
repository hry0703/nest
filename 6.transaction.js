const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin123456',
    database: 'oms',
    namedPlaceholders: true, // 这个配置的作用是启用命名占位符功能。
    connectionLimit: 10, // 连接池的最大连接数
    waitForConnections: true, // 当连接池已满时，是否等待连接可用
    queueLimit: 10 // 连接池的最大等待队列长度
});
(async function performTransaction() {
    const connection = await pool.getConnection();
    try {
        // 开始事务  事务是一组操作，要么全部成功执行，要么全部不执行。
        // 事务的重要性在于它保证了数据的一致性。例如，如果第一个插入成功但第二个插入失败，整个事务会回滚，第一个插入的效果也会被撤销，保证数据库的一致性。
        await connection.beginTransaction();
        // 执行一些数据库操作
        await connection.query(`insert into tags (name) values ('good')`);
        await connection.query(`insert into tags (name) values ('hry')`);
        await connection.commit();
    } catch (error) {
        await connection.rollback(); // - 如果在执行过程中发生任何错误， 会回滚事务，取消所有在事务中进行的更改
        console.error(error);
    } finally {
        // 不管事务是否成功，都要释放连接
        connection.release();
    }
})()
