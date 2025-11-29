// const { createLogger, transports, format } = require('winston');

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp(),
//     format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()} ${message}`)
//   ),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: 'logs/app.log', level: 'info' })
//   ]
// });

// module.exports = (req, res, next) => {
//   const time = new Date().toISOString();
//   const route = req.originalUrl;
//   const method = req.method;
//   logger.info(`${method} ${route}`);
//   next();
// };

const winston = require('winston');

// Create a custom logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

module.exports = logger;