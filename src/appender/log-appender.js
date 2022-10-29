import {LOG_LEVEL} from "../constants";
import {isAllowedLevel} from "../utils";

class Info {
    date = null;
    level = null;
    message = null;
    location = null;
}

function defaultConfig() {
    return {
        format: val => val,
        level: LOG_LEVEL.info,
        template: val => val
    }
}

export class LogAppender {
    config = null;

    constructor(config) {
        this.config = Object.assign(defaultConfig(), config);
    }

    isAllowed(level) {
        return isAllowedLevel(level, this.config.level);
    }

    log({message, level}) {
        return message;
    }

    format(value) {
        return this.config.format(value);
    }

    getMessage(info) {
        return this.config.template(info);
    }
}

