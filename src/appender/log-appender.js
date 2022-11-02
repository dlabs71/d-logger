import { LOG_LEVEL } from '../constants.js';
import {
    getLocation, isAllowedLevel, isError, mergeObjects,
} from '../utils.js';

function defaultFormattingString(value) {
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

function defaultConfig() {
    return {
        format: (val) => defaultFormattingString(val),
        level: LOG_LEVEL.info,
        template: (val) => val,
    };
}

export default class LogAppender {
    config = null;

    constructor(config) {
        this.config = mergeObjects(defaultConfig(), config);
    }

    isAllowed(level) {
        return isAllowedLevel(level, this.config.level);
    }

    format(value) {
        return this.config.format(value);
    }

    getMessage(info) {
        return this.config.template(info);
    }

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

        return this.getMessage({
            level,
            message: content,
            date: new Date(),
            location: getLocation(stepInStack),
        });
    }

    log(strings, level = null, stepInStack = null) {
        return this.creatingMessage(strings, level, stepInStack);
    }
}
