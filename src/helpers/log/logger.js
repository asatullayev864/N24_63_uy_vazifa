import winston from 'winston';
import 'winston-mongodb';
import config from '../../config/index.js';

const customTime = winston.format((info) => {
    const date = new Date();
    info.timestamp = date.toLocaleString('en-GB', { timeZone: 'Asia/Tashkent', hour12: false });
    return info;
});

const logger = winston.createLogger({
    level: 'error',
    transports: [
        // file log
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),


        // mongodb log
        new winston.transports.MongoDB({
            db: config.MONGO_URI,
            collection: 'errorLogs',
            level: 'error'
        })
    ],
    format: winston.format.combine(
        customTime(),
        winston.format.prettyPrint()
    )
});

export default logger;