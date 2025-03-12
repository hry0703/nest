const winston = require('winston')
// 创建一个日志记录器的实例
const logger = winston.createLogger({
    level: 'info',// 设置日志的级别
    format: winston.format.json(),// 设置日志的格式
    transports: [ // 配置日志的传输方法
        new winston.transports.Console(), // 写入控制台
        new winston.transports.File({ filename: 'combined.log' }) // 写入文件
    ]
})

logger.info('这是一条info日志')