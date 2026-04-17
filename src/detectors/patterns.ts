/**
 * Predefined log statement patterns for various programming languages.
 */
export const LOG_PATTERNS = {
    general: [
        'log.info',
        'log.debug',
        'log.verbose',
        'log.warn',
        'log.error',
        'log.fatal',
        'log.panic',
        'Log.info',
        'Log.debug',
        'Log.verbose',
        'Log.warn',
        'Log.error',
        'Log.fatal',
        'Log.panic',
    ],

    typescript: ['console.log', 'console.error', 'console.warn', 'console.info', 'console.debug', 'console.trace'],

    javascript: ['console.log', 'console.error', 'console.warn', 'console.info', 'console.debug', 'console.trace'],

    go: ['logger.Info', 'logger.Debug', 'logger.Error', 'logger.Warn', 'logger.Trace', 'logger.Fatal', 'logger.Panic'],
};
