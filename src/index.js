import DLoggerPlugin from './d-logger-plugin.js';
import $log, { DLogger } from './d-logger.js';
import ConsoleAppender from './appender/console-appender.js';
import FileAppender from './appender/file-appender.js';
import LogAppender, { LogMessageInfo } from './appender/log-appender.js';
import { createTemplate, templateFns } from './utils.js';

export {
    templateFns,
    createTemplate,
    LogMessageInfo,
    ConsoleAppender,
    FileAppender,
    LogAppender,
    DLogger,
    $log,
};

export default DLoggerPlugin;
