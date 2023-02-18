import moment from 'moment';
import emojify from 'node-emojify';
import { LOG_LEVEL_NUMBER } from './constants.js';

/**
 * Function for getting location (path to file and position in the file) where was calling logger method
 * This function based on throw Error and get needed row from stack trace
 * @param {number} stepInStack - number row in stack trace
 */
export function getLocation(stepInStack = 1) {
    try {
        throw new Error('Log stack');
    } catch (stackErr) {
        try {
            const stackLocations = stackErr.stack
                .split('\n')
                .map((m) => m.trim())
                .filter((m) => m.startsWith('at'));
            if (stackLocations.length <= stepInStack) {
                return 'parameter stepInStack is not valid. '
                    + `stepInStack = ${stepInStack} `
                    + `but stack length = ${stackLocations.length}`;
            }
            const location = String(stackLocations[stepInStack]);
            if (location.includes('(')) {
                return location.slice(location.indexOf('('));
            }
            return location.slice(3);
        } catch (err) {
            return '';
        }
    }
}

/**
 * Function for formatting result from function getLocation {@link getLocation}
 * @param {string} location - string location row from stack trace (result from {@link getLocation})
 * @param {boolean} abbreviated - use abbreviated format. Leave only the path to the file and the position in the file
 */
export function formatLocation(location, abbreviated = false) {
    if (!abbreviated) {
        return location;
    }
    let newLocation = location.replaceAll(/[()]/g, '').split('///').pop();
    if (newLocation.includes('!./')) {
        newLocation = newLocation.split('!./').pop();
    }
    return newLocation;
}

/**
 * functions for creating output logs information.
 * @constant
 * @type object
 * @property date - function for formatting date/time log row
 * @property location - function for formatting location called logger method
 * @property message - function for formatting user message
 * @property text - function for formatting user message with emoji
 * @property level - function for formatting level log
 * @property levelDate - function for formatting level and date jointly
 * @property newLine - function creating transition to a new line
 */
export const templateFns = {
    date: (dateFormat) => ({ date, dateL10n = 'en' }) => moment(date).locale(dateL10n).format(dateFormat),
    location: (abbreviated = false) => ({ location }) => formatLocation(location, abbreviated),
    message: () => ({ message }) => message,
    text: (message) => () => emojify(message),
    level: () => ({ level }) => level.toUpperCase(),
    levelDate: (dateFormat) => ({ level, date, dateL10n }) => {
        const dateStr = moment(date).locale(dateL10n).format(dateFormat);
        const levelStr = level.toUpperCase();
        return `${dateStr} | ${levelStr}`;
    },
    newLine: () => () => '\n',
};

/**
 * Creator common template from formatting functions {@link templateFns}
 * @param {functions[]} fns - formatting functions {@link templateFns}
 */
export function createTemplate(...fns) {
    return (info) => fns.reduce((prev, curr) => `${prev}${curr(info)}`, '');
}

/**
 * The function for determining logging permission depending on the set logging threshold
 * {@see LOG_LEVEL}
 * {@see LOG_LEVEL_NUMBER}
 * @param {string} level - current log level
 * @param {string} thresholdLevel - threshold log level
 */
export function isAllowedLevel(level, thresholdLevel) {
    const numberLevel = LOG_LEVEL_NUMBER[level];
    const numberBaseLevel = LOG_LEVEL_NUMBER[thresholdLevel];
    return numberLevel <= numberBaseLevel;
}

/**
 * Check the parameter is Error
 * @param {any} value - parameter for checking
 */
export function isError(value) {
    return !!(value && value.stack && value.message);
}

/**
 * Function to get the length of a string parameter.
 * If the parameter is null or undefined, then the function returns null or undefined, respectively.
 * @param {string} text - string
 */
export function len(text) {
    if (text === null || text === undefined) {
        return text;
    }
    return !text ? 0 : text.length;
}

/**
 * The function to the depersonalizing the string parameter "value".
 * Function return string concatenate name and length value.
 * @example
 *  depersonalizeValue("qwerty$4", "password");
 *  // return "password:8"
 * @param {string} value
 * @param {string} name
 */
export function depersonalizeValue(value, name) {
    return `${name}:${len(value)}`;
}

/**
 * The function of depersonalizing object fields from the "dataObj" parameter
 * @example
 *  let object = {
 *      login: "daivanov",
 *      password: "qwerty$4",
 *      secretKey: "12345678"
 *  };
 *  depersonalizeObj(object, "password", "secretKey");
 *  // return {
 *  //    login: "daivanov",
 *  //    password: "password:8",
 *  //    secretKey: "secretKey:8"
 *  // }
 *
 * @param {object|class} dataObj - source data object
 * @param {string[]} strings - field names for depersonalizing in "dataObj" parameter
 */
export function depersonalizeObj(dataObj, ...strings) {
    if (!dataObj) {
        return dataObj;
    }
    const objCopy = JSON.parse(JSON.stringify(dataObj));
    strings.forEach((item) => {
        let newObj = objCopy;
        let objKey = item;
        const splittedItem = item.split('.');
        for (let i = splittedItem.length; i < 0; i -= 1) {
            const key = splittedItem[splittedItem.length - i];
            if (i > 1) {
                newObj = newObj[key];
            }
            objKey = key;
        }
        newObj[objKey] = depersonalizeValue(newObj[objKey], objKey);
    });

    return objCopy;
}

/**
 * The function to merge two objects
 * @param {object} obj1 - source object
 * @param {object} obj2 - target object
 */
export function mergeObjects(obj1, obj2) {
    const mergedObj = obj1;
    Object.entries(obj2).forEach(([key, value]) => {
        if (value) {
            mergedObj[key] = value;
        }
    });
    return mergedObj;
}
