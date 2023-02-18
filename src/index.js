import DLoggerPlugin from './d-logger-plugin.js';
import $log, { DLogger } from './d-logger.js';
import ConsoleAppender from './appender/console-appender.js';
import LogAppender, { LogMessageInfo } from './appender/log-appender.js';
import { createTemplate, templateFns } from './utils.js';
import { LOG_LEVEL } from './constants.js';

export {
    templateFns,
    createTemplate,
    LogMessageInfo,
    ConsoleAppender,
    LogAppender,
    DLogger,
    $log,
    LOG_LEVEL,
    DLoggerPlugin,
};
