import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

winston.addColors(winston.config.syslog.colors);

export const logger = winston.createLogger({
	level: 'debug',
	levels: winston.config.syslog.levels,
	format: winston.format.combine(
		winston.format.colorize({ all: true }),
		winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A (ZZ)' }),
		winston.format.prettyPrint({ colorize: true }),
		winston.format.align(),
		winston.format.printf((info) => `[${info.level}] [${info['timestamp']}]: ${info.message}`),
	),
	transports: [
		new DailyRotateFile({
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			eol: '\n',
			extension: '.log',
			dirname: 'logs',
		}),
		new winston.transports.Console(),
	],
	exceptionHandlers: [
		new DailyRotateFile({
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			eol: '\n',
			extension: '.log',
			dirname: 'logs',
			filename: 'exceptions.%DATE%',
		}),
		new DailyRotateFile({
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			eol: '\n',
			extension: '.log',
			dirname: 'logs',
		}),
		new winston.transports.Console(),
	],
});
