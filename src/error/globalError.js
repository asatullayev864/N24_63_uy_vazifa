import logger from "../helpers/log/logger.js";

export const globalError = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const stack = err.stack || '';

    if (statusCode.toString().startsWith('5')) {
        logger.error(`${statusCode} ${message} ${stack}`);
    }

    return res.status(statusCode).json({
        statusCode,
        message
    });
}