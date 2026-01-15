// Simple logger utility
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (error: Error | string, ...args: any[]) => {
    if (error instanceof Error) {
      console.error(`[ERROR] ${error.message}`, error.stack, ...args);
    } else {
      console.error(`[ERROR] ${error}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};
