import ConsoleAppender from './appender/console-appender.js';
import {
    depersonalizeObj, depersonalizeValue, isAllowedLevel, len, mergeObjects,
} from './utils.js';
import FileAppender from './appender/file-appender.js';
import { LOG_LEVEL } from './constants.js';

function defaultConfig() {
    return {
        appenders: [],
        level: process.argv.includes('--debug-mode') ? 'debug' : process.env.D_LOGGER_LOG_LEVEL
            || process.env.VUE_APP_D_LOGGER_LOG_LEVEL
            || 'debug',
        template: null,
    };
}

export class DLogger {
    config = null;

    constructor(config = {}) {
        this.configure(config || {});
    }

    configure(config) {
        this.config = mergeObjects(defaultConfig(), config);
        this.config.appenders.push(new ConsoleAppender({ level: this.config.level }));
        this.defineLogMethods();
    }

    defineLogMethods() {
        Object.keys(LOG_LEVEL).forEach((item) => {
            this[item] = this.log(item);
        });
    }

    addFileAppender(
        pathToDir,
        isRotatingFiles = false,
        filePrefix = null,
        level = null,
        template = null,
    ) {
        this.config.appenders.push(
            new FileAppender({
                level: level || this.config.level,
                directory: pathToDir,
                filePrefix: filePrefix || process.env.VUE_APP_LOG_FILE_PREFIX || 'app',
                template: template || this.config.template,
                isRotatingFiles,
            }),
        );
    }

    addConsoleAppender(level = null, colorize = true, template = null, stepInStack = 5) {
        this.config.appenders.push(
            new ConsoleAppender({
                level: level || this.config.level,
                colorize,
                template: template || this.config.template,
                stepInStack,
            }),
        );
    }

    addCustomAppender(appender) {
        return this.config.appenders.push(appender);
    }

    clearAppenders() {
        this.config.appenders = [];
    }

    log(level) {
        if (!isAllowedLevel(level, this.config.level)) {
            return (...strings) => strings;
        }

        if (!this.config.appenders || this.config.appenders.length === 0) {
            throw new Error('log list appenders is empty');
        }

        return (...strings) => this.config.appenders.forEach((appender) => appender.log(strings, level));
    }

    getFileAppenders() {
        return this.config.appenders.filter((item) => item instanceof FileAppender);
    }

    existFileAppender() {
        return this.getFileAppenders().length > 0;
    }

    deleteAllFileLogs() {
        const fileAppenders = this.getFileAppenders();
        const promises = [];
        if (fileAppenders.length > 0) {
            fileAppenders.forEach((appender) => {
                promises.push(appender.formatStoredLogs());
            });
        }
        if (promises.length === 0) {
            return new Promise((resolve) => resolve());
        }
        return Promise.all(promises);
    }

    logProcessEnvs() {
        let logStr = '';
        Object.keys(process.env).forEach((key) => {
            logStr += `${key}=${process.env[key]};\n`;
        });
        this.info(`Process envs:\n\n${logStr}`);
    }

    depersonalizeObj() {
        return depersonalizeObj();
    }

    depersonalizeValue() {
        return depersonalizeValue();
    }

    len() {
        return len();
    }
}

const $log = new DLogger();

export default $log;
