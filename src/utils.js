import moment from 'moment';
import emojify from 'node-emojify';
import { LOG_LEVEL_NUMBER } from './constants.js';

export function getLocation(stepInStack = 1) {
    try {
        throw new Error('Log stack');
    } catch (stackErr) {
        try {
            const stackLocations = stackErr.stack
                .split('\n')
                .map((m) => m.trim())
                .filter((m) => m.startsWith('at'));
            return String(stackLocations[stepInStack]).slice(3);
        } catch (err) {
            return '';
        }
    }
}

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

export const format = {
    date: (dateFormat) => ({ date }) => moment(date).format(dateFormat),
    location: (abbreviated = false) => ({ location }) => formatLocation(location, abbreviated),
    message: () => ({ message }) => message,
    text: (message) => () => emojify(message),
    level: () => ({ level }) => level.toUpperCase(),
    levelDate: (dateFormat) => ({ level, date }) => `${moment(date).format(dateFormat)} | ${level.toUpperCase()}`,
    newLine: () => () => '\n',
};

export function createTemplate(...fns) {
    return (info) => fns.reduce((prev, curr) => `${prev}${curr(info)}`, '');
}

export function isAllowedLevel(level, baseLevel) {
    const numberLevel = LOG_LEVEL_NUMBER[level];
    const numberBaseLevel = LOG_LEVEL_NUMBER[baseLevel];
    return numberLevel <= numberBaseLevel;
}

export function isError(e) {
    return !!(e && e.stack && e.message);
}

export function len(text) {
    if (text === null || text === undefined) {
        return text;
    }
    return !text ? 0 : text.length;
}

export function depersonalizeValue(value, name) {
    return `${name}:${len(value)}`;
}

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

export function mergeObjects(obj1, obj2) {
    const mergedObj = obj1;
    Object.entries(obj2).forEach(([key, value]) => {
        if (value) {
            mergedObj[key] = value;
        }
    });
    return mergedObj;
}
