import { createLogger, transports, format } from 'winston';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const logDir = join(__dirname, '../logs');

// 检查并创建日志目录
if (!existsSync(logDir)) {
  try {
    mkdirSync(logDir);
  } catch (error) {
    console.error('无法创建日志目录:', error);
  }
}

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      const localTimestamp = new Date(timestamp).toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai', // 设置为 CST
        hour12: false, // 24小时制
      });
      return `${localTimestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new transports.File({
      filename: `${logDir}/nest-test-${new Date().toISOString().split('T')[0]}.log`,
      level: 'info',
    }),
    new transports.File({
      filename: `${logDir}/error-${new Date().toISOString().split('T')[0]}.log`,
      level: 'error', // 错误日志
    }),
    new transports.File({
      filename: `${logDir}/warn-${new Date().toISOString().split('T')[0]}.log`,
      level: 'warn', // 警告日志
    }),
    new transports.Console({
      level: 'debug',
    }),
  ],
});

// 可选：根据环境变量设置日志级别
const envLogLevel = process.env.LOG_LEVEL || 'info';
logger.level = envLogLevel;

export default logger;
