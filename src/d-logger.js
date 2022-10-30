import {ConsoleAppender} from "./appender/console-appender";
import {getLocation, isAllowedLevel} from "./utils";
import {FileAppender} from "./appender/file-appender";

const defaultConfig = {
    appenders: [],
    level: process.argv.includes("--debug-mode") ? "debug" : process.env.VUE_APP_LOG_LEVEL || 'debug',
};

export class DLogger {
    config = null;

    constructor(config = {}) {
        this.configure(!config ? {} : config);
    }

    configure(config) {
        this.config = {...defaultConfig, ...config};
        this.config.appenders.push(new ConsoleAppender({level: this.config.level}));
        this.emerg = this.log('emerg');
        this.alert = this.log('alert');
        this.crit = this.log('crit');
        this.error = this.log('error');
        this.warning = this.log('warning');
        this.notice = this.log('notice');
        this.info = this.log('info');
        this.debug = this.log('debug');
    }

    addFileAppender(pathToDir, isRotatingFiles = false, filePrefix = null, level = null) {
        this.config.appenders.push(
            new FileAppender({
                level: level || this.config.level,
                directory: pathToDir,
                filePrefix: filePrefix || process.env.VUE_APP_LOG_FILE_PREFIX || "app",
                isRotatingFiles: isRotatingFiles
            })
        )
    }

    log(level) {
        if (!isAllowedLevel(level, this.config.level)) {
            return (...strings) => {
            };
        }

        return (...strings) => {
            return this.config.appenders.forEach((appender) => {
                if (!appender.isAllowed(level)) {
                    return null;
                }

                const content = strings.reduce((prev, curr, index) => {
                    return `${prev} ${appender.format(curr)}`;
                }, '');

                const message = appender.getMessage({
                    level,
                    message: content,
                    date: new Date(),
                    location: getLocation(4),
                });

                return appender.log({level, message});
            });
        };
    };

    getFileAppenders() {
        return this.config.appenders.filter(item => {
            return item instanceof FileAppender;
        });
    }

    existFileAppender() {
        return this.getFileAppenders().length > 0;
    }

    deleteAllFileLogs() {
        let fileAppenders = this.getFileAppenders();
        let promises = [];
        if (fileAppenders.length > 0) {
            fileAppenders.forEach(appender => {
                promises.push(appender.formatStoredLogs());
            });
        }
        return Promise.all(promises);
    }

    len(text) {
        if (text === null || text === undefined) {
            return text;
        }
        return !text ? 0 : text.length;
    }

    depersObj(obj, ...strings) {
        if (!obj) {
            return obj;
        }
        let objCopy = JSON.parse(JSON.stringify(obj));
        strings.forEach(item => {
            let obj = objCopy;
            let objKey = item;
            let splittedItem = item.split(".");
            for (let i = splittedItem.length; i < 0; i--) {
                let key = splittedItem[splittedItem.length - i];
                if (i > 1) {
                    obj = obj[key];
                }
                objKey = key;
            }
            obj[objKey] = this.depersVal(obj[objKey], objKey);
        });

        return objCopy;
    }

    depersVal(text, name) {
        return `${name}:${this.log(text)}`;
    }

    logProcessEnvs() {
        let logStr = "";
        Object.keys(process.env).forEach(key => {
            logStr += `${key}=${process.env[key]};\n`;
        });
        this.info(`Process envs:\n\n${logStr}`);
    }
}

const $log = new DLogger();

export default $log;