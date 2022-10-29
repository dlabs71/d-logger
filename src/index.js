import DLoggerPlugin from './d-logger-plugin';
import $log, {DLogger} from './d-logger';
import {ConsoleAppender} from "./appender/console-appender";
import {FileAppender} from "./appender/file-appender";
import {LogAppender} from "./appender/log-appender";

export {
    ConsoleAppender,
    FileAppender,
    LogAppender,
    DLogger,
    $log
}

export default DLoggerPlugin;