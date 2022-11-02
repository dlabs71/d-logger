import LogAppender from './log-appender.js';
import { createTemplate, format, mergeObjects } from '../utils.js';
import { LOG_LEVEL2METHOD, LOG_LEVEL_COLOR } from '../constants.js';

function defaultConfig() {
    return {
        level: 'info',
        colorize: true,
        template: createTemplate(
            format.levelDate('DD.MM.YYYY HH:mm:ss'),
            format.newLine(),
            format.location(),
            format.newLine(),
            format.message(),
        ),
        stepInStack: 5,
    };
}

export default class ConsoleAppender extends LogAppender {
    constructor(config) {
        const mergedConfig = mergeObjects(defaultConfig(), config);
        super(mergedConfig);
    }

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
