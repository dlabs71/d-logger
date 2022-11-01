export const LOG_LEVEL = {
    emerg: 'emerg',
    alert: 'alert',
    crit: 'crit',
    error: 'error',
    warn: 'warn',
    notice: 'notice',
    info: 'info',
    debug: 'debug',
};

export const LOG_LEVEL_COLOR = {
    [LOG_LEVEL.emerg]: 'red',
    [LOG_LEVEL.alert]: 'orange',
    [LOG_LEVEL.crit]: 'red',
    [LOG_LEVEL.error]: 'red',
    [LOG_LEVEL.warn]: 'yellow',
    [LOG_LEVEL.notice]: 'blue',
    [LOG_LEVEL.info]: 'green',
    [LOG_LEVEL.debug]: 'rainbow',
};

export const LOG_LEVEL_NUMBER = {
    [LOG_LEVEL.emerg]: 0,
    [LOG_LEVEL.alert]: 1,
    [LOG_LEVEL.crit]: 2,
    [LOG_LEVEL.error]: 3,
    [LOG_LEVEL.warn]: 4,
    [LOG_LEVEL.notice]: 5,
    [LOG_LEVEL.info]: 6,
    [LOG_LEVEL.debug]: 7,
};
