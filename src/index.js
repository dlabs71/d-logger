import DLoggerPlugin from './d-logger-plugin.js';
import dlog, { DLogger } from './d-logger.js';
import ConsoleAppender from './appender/console-appender.js';
import LogAppender, { LogMessageInfo } from './appender/log-appender.js';
import { createTemplate, templateFns } from './utils.js';
import { LOG_LEVEL } from './constants.js';
import {useDLog} from "./dlog-composable.js";

export {
    templateFns,
    createTemplate,
    LogMessageInfo,
    ConsoleAppender,
    LogAppender,
    DLogger,
    dlog,
    LOG_LEVEL,
    DLoggerPlugin,
    useDLog
};
