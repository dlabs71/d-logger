import DLoggerPlugin from './d-logger-plugin.js';
import $log, { DLogger } from './d-logger.js';
import ConsoleAppender from './appender/console-appender.js';
import FileAppender from './appender/file-appender.js';
import LogAppender from './appender/log-appender.js';

export {
    ConsoleAppender,
    FileAppender,
    LogAppender,
    DLogger,
    $log,
};

export default DLoggerPlugin;
