const winston = require('winston')
const { combine, timestamp, printf } = winston.format
require('winston-daily-rotate-file')

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} ${message}` // 2025-03-12T13:20:57.428Z info 这是一条info日志
})
// 创建一个日志记录器的实例
const logger = winston.createLogger({
    level: 'info',// 设置日志的级别
    // 设置日志的格式
    // 结合时间戳和自定义格式化的函数
    format: combine(
        timestamp(), // 添加时间戳
        myFormat  // 应用自定义格式化
    ),
    transports: [ // 配置日志的传输方法
        new winston.transports.DailyRotateFile({
            //指定日志文件的文件名模式
            filename: 'app-%DATE%.log',
            //指定文件的目录
            dirname: './logs',
            //指定日期的格式
            dataPattern: 'YYYY-MM-DD',
            //指定日志的等级
            level: 'info',
            //设置日志的最大文件大小
            maxSize: '20m',
            //设置日志文件的最大保留天数 14天会自动删除
            maxFiles: '14d',
            // 指定是否压缩旧的日志文件
            zippedArchive: true
        }), // 写入控制台
    ]
})

logger.error('这是一条info日志')  // 消息级别