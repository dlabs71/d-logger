import LogAppender from './log-appender.js';
import { createTemplate, templateFns, mergeObjects } from '../utils.js';
import { LOG_LEVEL2METHOD, LOG_LEVEL_COLOR } from '../constants.js';

/**
 * Default configuration for ConsoleAppender {@see ConsoleAppender}
 * level - log level threshold {@see LOG_LEVEL}
 * colorize - colorize of row log
 * template - template for log row
 * stepInStack - number row in stack trace {@see getLocation}
 */
function defaultConfig() {
    return {
        level: 'info',
        colorize: true,
        template: createTemplate(
            templateFns.levelDate('DD.MM.YYYY HH:mm:ss'),
            templateFns.newLine(),
            templateFns.location(),
            templateFns.newLine(),
            templateFns.message(),
        ),
        stepInStack: 6,
    };
}

/**
 * Class for logging using console {@see Console}
 * @extends LogAppender
 */
export default class ConsoleAppender extends LogAppender {
    /**
     * @param {object} config - {@see defaultConfig}
     */
    constructor(config) {
        const mergedConfig = mergeObjects(defaultConfig(), config);
        super(mergedConfig);
    }

    /**
     * Method for obtaining a function for logging
     * @param level - log level {@see LOG_LEVEL}
     * @returns {function} console function for logging
     * @private
     */
    __getConsoleMethod(level) {
        // eslint-disable-next-line no-console
        if (level in LOG_LEVEL2METHOD) {
            const method = LOG_LEVEL2METHOD[level];
            if (method) {
                return method;
            }
        }
        // eslint-disable-next-line no-console
        return console.log;
    }

    /**
     * {@see LogAppender.log}
     */
    log(strings, level = null, stepInStack = null) {
        const message = this.creatingMessage(strings, level, stepInStack);
        if (!message) {
            return null;
        }

        const logToConsole = this.__getConsoleMethod(level);

        if (this.config.colorize) {
            logToConsole(`%c${message}\n`, `color: ${LOG_LEVEL_COLOR[level]}`);
        } else {
            logToConsole(`${message}\n`);
        }
        return message;
    }
}
