import { LOG_LEVEL } from '../constants.js';
import {
    getLocation, isAllowedLevel, isError, mergeObjects,
} from '../utils.js';

/**
 * The function converting parameter "value" to string
 * @param {any} value - parameter for converting
 * @returns {string} formatted value
 */
function defaultConvertValue(value) {
    if (typeof value === 'function') {
        value = value();
    }
    if (isError(value)) {
        return value.toString();
    }
    if (typeof value === 'object' || Array.isArray(value)) {
        return JSON.stringify(value);
    }

    return String(value);
}

/**
 * Default configuration for LogAppender {@see LogAppender}
 * format - function converting/formatting log value to string.
 *          By default using defaultConvertValue function {@see defaultConvertValue}
 * level - threshold logging level {@see LOG_LEVEL}
 * template - function for templating logging row {@see createTemplate}
 */
function defaultConfig() {
    return {
        format: (val) => defaultConvertValue(val),
        level: LOG_LEVEL.info,
        template: (val) => val,
    };
}

/**
 * Logging message information
 * @class
 */
export class LogMessageInfo {
    level = null;

    message = null;

    date = null;

    location = null;

    /**
     * @param {string} level - logging level {@see LOG_LEVEL}
     * @param {string} message - user message for logging
     * @param {Date} date - data logging
     * @param {string} location - call log location
     */
    constructor(level, message, date, location) {
        this.level = level;
        this.message = message;
        this.date = date;
        this.location = location;
    }
}

/**
 * Base class for creating logging appender
 * @class
 * @abstract
 */
export default class LogAppender {
    config = null;

    /**
     * @param {object} config {@see defaultConfig}
     */
    constructor(config) {
        this.config = mergeObjects(defaultConfig(), config);
    }

    /**
     * The method for determining logging permission depending on the set logging threshold in this appender config
     * @param {string} level - current log level
     * @returns {boolean}
     */
    isAllowed(level) {
        return isAllowedLevel(level, this.config.level);
    }

    /**
     * Helper method for converting/formatting attribute of logging {@see defaultConvertValue}
     * @param value - data for converting/formatting
     * @returns {string}
     */
    format(value) {
        return this.config.format(value);
    }

    /**
     *
     * @param {LogMessageInfo} info - data to create a log line
     * @returns {string}
     */
    getMessage(info) {
        return this.config.template(info);
    }

    /**
     * Create a log message for later templating
     * @param {string[]} strings - logging attributes
     * @param {string|null} level - active logging level {@see LOG_LEVEL}. By default using this.config.level
     * @param {number|null} stepInStack - number row in stack trace {@see getLocation}.
     *                                    By default using this.config.stepInStack
     * @returns {null|LogMessageInfo} - data for templating. {@see LogMessageInfo}
     */
    creatingMessage(strings, level = null, stepInStack = null) {
        if (!level) {
            level = this.config.level;
        }
        if (!stepInStack) {
            stepInStack = this.config.stepInStack;
        }
        if (!this.isAllowed(level) || !strings) {
            return null;
        }

        const content = strings.reduce((prev, curr) => `${prev} ${this.format(curr)}`, '');

        return this.getMessage(new LogMessageInfo(level, content, new Date(), getLocation(stepInStack)));
    }

    /**
     * Log printing method
     * @abstract
     * @param {string[]} strings - logging attributes
     * @param {string|null} level - active logging level {@see LOG_LEVEL}
     * @param {number|null} stepInStack - number row in stack trace {@see getLocation}
     * @returns {string|null} message for printing
     */
    log(strings, level = null, stepInStack = null) {
        // implement printing here
        return this.creatingMessage(strings, level, stepInStack);
    }
}
