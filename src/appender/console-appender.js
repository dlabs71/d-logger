import {LogAppender} from "./log-appender.js";
import {createTemplate, format, isError} from "../utils.js";
import {LOG_LEVEL_COLOR} from "../constants.js";

const defaultConfig = {
    level: 'info',
    colorize: true,
    template: createTemplate(
        format.levelDate('DD.MM.YYYY HH:mm:ss'),
        format.newLine(),
        format.location(),
        format.newLine(),
        format.message(),
    ),
};

export class ConsoleAppender extends LogAppender {

    constructor(unsafeConfig) {
        const config = {...defaultConfig, ...unsafeConfig};
        super(config);
    }

    format(value) {
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

    __getConsoleMethod(level) {
        const method = console[level];
        if (method) {
            return method;
        }
        return console.log;
    }

    log({message, level}) {
        let msg = message;
        const logToConsole = this.__getConsoleMethod(level);

        if (this.config.colorize) {
            logToConsole(`%c${msg}\n`, `color: ${LOG_LEVEL_COLOR[level]}`);
        } else {
            logToConsole(`${msg}\n`);
        }
        return msg;
    }
}
