import ConsoleAppender from './appender/console-appender.js';
import {
    depersonalizeObj, depersonalizeValue, isAllowedLevel, len, mergeObjects,
} from './utils.js';
import { LOG_LEVEL } from './constants.js';

/**
 * Function for getting default log level
 * 1) node process argument: --debug-mode. Then default log level is debug
 * 2) node process env property: D_LOGGER_LOG_LEVEL or VUE_APP_D_LOGGER_LOG_LEVEL
 * @returns {string} log level {@see LOG_LEVEL}
 */
export function getDefaultLevel() {
    if (typeof process !== 'undefined') {
        if (!!process.argv && process.argv.includes('--debug-mode')) {
            return 'debug';
        }
    }
    return process.env.D_LOGGER_LOG_LEVEL
        || process.env.VUE_APP_D_LOGGER_LOG_LEVEL
        || 'debug';
}

/**
 * Default config for DLogger {@see DLogger}
 * appenders - list appender
 * level - log level threshold. By default - debug {@see LOG_LEVEL}.
 *         Log level can also be specified with one of the following images:
 *              - define process env: process.env.D_LOGGER_LOG_LEVEL
 *              - define process env: process.env.VUE_APP_D_LOGGER_LOG_LEVEL
 *              - define process arg: --debug-mode (process.argv.includes('--debug-mode'))
 * template - default function for templating log row
 * stepInStack - number row in stack trace {@see getLocation}
 */
function defaultConfig() {
    return {
        appenders: [],
        level: getDefaultLevel(),
        template: null,
        stepInStack: 6,
        dateL10n: 'en',
    };
}

/**
 * Base logger class
 */
export class DLogger {
    config = null;

    /**
     * @param {object} config - {@see defaultConfig}
     */
    constructor(config = {}) {
        this.configure(config || {});
    }

    /**
     * Method for configuration logger.
     * By default ConsoleAppender added to logger appenders.
     * Creating logging methods that correspond to logging levels {@see LOG_LEVEL}
     * @param {object} config - {@see defaultConfig}
     */
    configure(config) {
        this.config = mergeObjects(defaultConfig(), config);
        if (this.config.appenders.length === 0) {
            this.addConsoleAppender(this.config.level, true, null, this.config.stepInStack);
        }
        this.__defineLogMethods();
    }

    /**
     * Creating logging methods that correspond to logging levels {@see LOG_LEVEL}
     * @private
     */
    __defineLogMethods() {
        Object.keys(LOG_LEVEL).forEach((item) => {
            this[item] = this.__log(item);
        });
    }

    /**
     * Adding console appender
     * @param level - log level threshold {@see LOG_LEVEL}
     * @param colorize - colorize of row log
     * @param template - template for log row
     * @param stepInStack - number row in stack trace {@see getLocation}
     * @param dateL10n - date localization (ru, en ...) {@see moment}
     */
    addConsoleAppender(level = null, colorize = true, template = null, stepInStack = null, dateL10n = 'en') {
        this.config.appenders.push(
            new ConsoleAppender({
                level: level || this.config.level,
                colorize,
                template: template || this.config.template,
                stepInStack: stepInStack || this.config.stepInStack,
                dateL10n: dateL10n || this.config.dateL10n,
            }),
        );
    }

    /**
     * Method for adding custom appneder extended by LogAppender {@see LogAppender}
     * @returns {number}
     */
    addCustomAppender(appender) {
        return this.config.appenders.push(appender);
    }

    /**
     * Deleting all appenders
     */
    clearAppenders() {
        this.config.appenders = [];
    }

    /**
     * Method creating logging function based on log level
     * @param level - log level {@see LOG_LEVEL}
     * @private
     */
    __log(level) {
        if (!isAllowedLevel(level, this.config.level)) {
            return (...strings) => strings;
        }

        if (!this.config.appenders || this.config.appenders.length === 0) {
            throw new Error('log list appenders is empty');
        }

        return (...strings) => this.config.appenders.forEach((appender) => appender.log(strings, level));
    }

    /**
     * Printing all process.env
     */
    logProcessEnvs() {
        let logStr = '';
        Object.keys(process.env).forEach((key) => {
            logStr += `${key}=${process.env[key]};\n`;
        });
        this.info(`Process envs:\n\n${logStr}`);
    }

    /**
     * The function of depersonalizing object fields from the "dataObj" parameter
     * {@see depersonalizeObj}
     */
    dprsObj(dataObj, ...strings) {
        return depersonalizeObj(dataObj, ...strings);
    }

    /**
     * The function to the depersonalizing the string parameter "value".
     * {@see depersonalizeValue}
     */
    dprsValue(value, name) {
        return depersonalizeValue(value, name);
    }

    /**
     * Function to get the length of a string parameter.
     * {@see len}
     */
    len(text) {
        return len(text);
    }
}

const $log = new DLogger();

export default $log;
