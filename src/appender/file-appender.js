import {LogAppender} from "./log-appender";
import {createTemplate, format, isError} from "../utils";
import fs from 'fs';
import {join} from 'path';
import moment from "moment";

const defaultConfig = {
    level: 'info',
    directory: null,
    filePrefix: process.env.VUE_APP_LOG_FILE_PREFIX || "app",
    numberOfFiles: process.env.VUE_APP_LOG_FILE_COUNT || 5,
    isRotatingFiles: false,
    template: createTemplate(
            format.level(),
            format.text(' - '),
            format.date('DD.MM.YYYY HH:mm:ss'),
            format.text(' - '),
            format.location(true),
            format.newLine(),
            format.message(),
            format.newLine()
    ),
};

export class FileAppender extends LogAppender {
    __fileStream = null;

    constructor(unsafeConfig) {
        const config = {...defaultConfig, ...unsafeConfig};
        super(config);

        this.config.path = join(config.directory, `${config.filePrefix}.${moment().format("YYYY-MM-DD")}.log`);
        this.initCurrentLogFile();
    }

    initCurrentLogFile() {
        this.__fileStream = fs.createWriteStream(this.config.path, {flags: 'a'});
        if (this.config.isRotatingFiles) {
            this.rotateLogFiles();
        }
    }

    rotateLogFiles() {
        fs.readdir(this.config.directory, (err, files) => {
            if (!!err) {
                console.error(err);
                return;
            }
            files = files.filter(item => item.startsWith(this.config.filePrefix) && item.endsWith(".log"));
            if (files.length < this.config.numberOfFiles) {
                return;
            }
            files = files.sort((item1, item2) => {
                let date1 = moment(item1.split('.')[1]);
                let date2 = moment(item2.split('.')[1]);
                return date1 - date2;
            });
            for (let i = 0; i <= files.length - this.config.numberOfFiles; i++) {
                fs.rm(join(this.config.directory, files[i]), (err) => {
                    if (!!err) {
                        console.error(err);
                    }
                })
            }
        })
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

    log({message, level}) {
        this.__fileStream.write(`${message}\n`);
        return message;
    }

    formatStoredLogs() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.config.directory, (err, files) => {
                if (!!err) {
                    reject(err);
                    return;
                }
                try {
                    files = files.filter(item => item.startsWith(this.config.filePrefix) && item.endsWith(".log"));
                    files.forEach(item => {
                        fs.rmSync(join(this.config.directory, item));
                    });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }).finally(() => {
            this.initCurrentLogFile();
        });
    }
}