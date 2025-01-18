import winston from 'winston';
import { config } from '../config';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;