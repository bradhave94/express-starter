// Replace Winston with Bun's built-in logger
import { config } from '../config';

const logger = {
  level: config.env === 'production' ? 'info' : 'debug',

  info(message: string, meta?: Record<string, unknown>) {
    console.log(`[INFO] ${message}`, meta || '');
  },

  error(message: string, meta?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, meta || '');
  },

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.level === 'debug') {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
};

export default logger;