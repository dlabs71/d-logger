import { LOG_LEVEL } from '../constants.js';
import { isAllowedLevel } from '../utils.js';

function defaultConfig() {
    return {
        format: (val) => val,
        level: LOG_LEVEL.info,
        template: (val) => val,
    };
}

export default class LogAppender {
    config = null;

    constructor(config) {
        this.config = { ...defaultConfig(), ...config };
    }

    isAllowed(level) {
        return isAllowedLevel(level, this.config.level);
    }

    // eslint-disable-next-line no-unused-vars
    log({ message, level }) {
        return message;
    }

    format(value) {
        return this.config.format(value);
    }

    getMessage(info) {
        return this.config.template(info);
    }
}
