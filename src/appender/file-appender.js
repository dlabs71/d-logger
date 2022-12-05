import moment from 'moment';
import { createTemplate, mergeObjects, templateFns } from '../utils.js';
import LogAppender from './log-appender.js';

function fs() {
    return require('fs');
}

function join(...paths) {
    return require('path').join(...paths);
}

/**
 * Default configuration for FileAppender {@see FileAppender}
 * level - log level threshold {@see LOG_LEVEL}
 * directory - log directory
 * filePrefix - file prefix for log files.
 * numberOfFiles - maximum count of log files. Using with isRotatingFiles = true
 * isRotatingFiles - use rotating log files. Delete old files
 * template - template for log row
 * stepInStack - number row in stack trace {@see getLocation}
 */
function defaultConfig() {
    return {
        level: 'info',
        directory: null,
        filePrefix: process.env.VUE_APP_LOG_FILE_PREFIX || 'app',
        numberOfFiles: process.env.VUE_APP_LOG_FILE_COUNT || 5,
        isRotatingFiles: false,
        template: createTemplate(
            templateFns.level(),
            templateFns.text(' - '),
            templateFns.date('DD.MM.YYYY HH:mm:ss'),
            templateFns.text(' - '),
            templateFns.location(true),
            templateFns.newLine(),
            templateFns.message(),
            templateFns.newLine(),
        ),
        stepInStack: 6,
    };
}

/**
 * Class for logging into files
 * @extends LogAppender
 */
export default class FileAppender extends LogAppender {
    __fileStream = null;

    /**
     * @param {object} config - {@see defaultConfig}
     */
    constructor(config) {
        const mergedConfig = mergeObjects(defaultConfig(), config);
        super(mergedConfig);

        this.config.path = join(config.directory, `${config.filePrefix}.${moment().format('YYYY-MM-DD')}.log`);
        this.initCurrentLogFile().finally(() => {
        });
    }

    /**
     * Initialize fileStream for logging. Launching the log file rotation mechanism, if it is enabled
     * @returns {Promise<unknown>}
     */
    initCurrentLogFile() {
        return new Promise((resolve) => {
            this.__fileStream = fs().createWriteStream(this.config.path, { flags: 'a' });
            if (this.config.isRotatingFiles) {
                this.rotateLogFiles().finally(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Log files rotating mechanism.
     * Deleting old log files. Will be saved only {config.numberOfFiles} count log files.
     * @returns {Promise<unknown>}
     */
    rotateLogFiles() {
        return new Promise((resolve, reject) => {
            fs().readdir(this.config.directory, (readDirErr, files) => {
                if (readDirErr) {
                    // eslint-disable-next-line no-console
                    console.error(readDirErr);
                    reject(readDirErr);
                    return;
                }
                files = files.filter((item) => item.startsWith(this.config.filePrefix) && item.endsWith('.log'));
                if (files.length < this.config.numberOfFiles) {
                    resolve();
                    return;
                }
                files = files.sort((item1, item2) => {
                    const date1 = moment(item1.split('.')[1]);
                    const date2 = moment(item2.split('.')[1]);
                    return date1 - date2;
                });
                for (let i = 0; i <= files.length - this.config.numberOfFiles; i += 1) {
                    try {
                        fs().rmSync(join(this.config.directory, files[i]));
                    } catch (rmErr) {
                        // eslint-disable-next-line no-console
                        console.error(rmErr);
                    }
                }
                resolve();
            });
        });
    }

    /**
     * {@see LogAppender.log}
     */
    log(strings, level = null, stepInStack = null) {
        const message = this.creatingMessage(strings, level, stepInStack);
        if (!message) {
            return null;
        }

        this.__fileStream.write(`${message}\n`);
        return message;
    }

    /**
     * Deleting all log files and then reinitializing fileAppender
     * @returns {Promise}
     */
    formatStoredLogs() {
        return new Promise((resolve, reject) => {
            fs().readdir(this.config.directory, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    files = files.filter((item) => item.startsWith(this.config.filePrefix) && item.endsWith('.log'));
                    files.forEach((item) => {
                        fs().rmSync(join(this.config.directory, item));
                    });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }).finally(() => this.initCurrentLogFile());
    }
}
