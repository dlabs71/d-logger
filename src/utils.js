import moment from "moment";
import emojify from "node-emojify";
import {LOG_LEVEL_NUMBER} from "./constants";

export function getLocation(stepInStack = 1) {
    try {
        throw new Error('Log stack');
    } catch (e) {
        try {
            const err = e;
            const stackLocations = err.stack
                    .split('\n')
                    .map((m) => m.trim())
                    .filter((m) => m.startsWith('at'));
            return String(stackLocations[stepInStack]).slice(3);
        } catch (e) {
            return '';
        }
    }
}

export function formatLocation(location, abbreviated = false) {
    if (!abbreviated) {
        return location;
    }
    let newLocation = location.replaceAll(/[()]/g, "").split("///./").pop();
    if (newLocation.includes("!./")) {
        newLocation = newLocation.split("!./").pop();
    }
    return newLocation;
}

export const format = {
    date: (format) => ({date}) => moment(date).format(format),
    location: (abbreviated = false) => ({location}) => formatLocation(location, abbreviated),
    message: () => ({message}) => message,
    text: (message) => () => emojify(message),
    level: () => ({level}) => level.toUpperCase(),
    levelDate: (format) => ({level, date}) => `${moment(date).format(format)} | ${level.toUpperCase()}`,
    newLine: () => () => '\n',
}

export function createTemplate(...fns) {
    return (info) => {
        return fns.reduce((prev, curr) => {
            return `${prev}${curr(info)}`;
        }, '');
    };
}

export function isAllowedLevel(level, baseLevel) {
    let numberLevel = LOG_LEVEL_NUMBER[level];
    let numberBaseLevel = LOG_LEVEL_NUMBER[baseLevel];
    return numberLevel <= numberBaseLevel;
}

export function isError(e) {
    return e && e.stack && e.message;
}