import winston from 'winston';
import expressWinston from 'express-winston';

const colorize = process.env.NODE_ENV !== 'production';

// Logger to capture all requests and output them to the console.
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: false,
      colorize
    })
  ],
  expressFormat: true,
  meta: false
});

// Logger to capture any top-level errors and output json diagnostic info.
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize
    })
  ]
});

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      json: false,
      colorize
    })
  ]
});
