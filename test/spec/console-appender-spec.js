import {ConsoleAppender, LOG_LEVEL} from "../../src/index.js";

describe("testing console appender", () => {

    const DEFAULT_LEVEL = "debug";

    it("check format function", () => {
        const consoleAppender = new ConsoleAppender({
            level: DEFAULT_LEVEL,
        });
        const error = new Error("it is error");
        const functionVal = () => {
            return "it is function"
        };
        const object = {parameter1: "qwerty", parameter2: 123};
        const array = [1, 2, 3, 4, 5];
        const val2res = [
            [functionVal, "it is function"],
            [error, error.toString()],
            [object, JSON.stringify(object)],
            [array, JSON.stringify(array)],
            [234, "234"]
        ]

        // checking function
        let val2resFn = val2res[0];
        let resultFn = consoleAppender.format(val2resFn[0]);
        expect(resultFn).toEqual(jasmine.any(String));
        expect(resultFn).toBe(val2resFn[1]);

        // checking error/exception
        let val2resErr = val2res[1];
        let resultErr = consoleAppender.format(val2resErr[0]);
        expect(resultErr).toEqual(jasmine.any(String));
        expect(resultErr).toBe(val2resErr[1]);

        // checking object
        let val2resObj = val2res[2];
        let resultObj = consoleAppender.format(val2resObj[0]);
        expect(resultObj).toEqual(jasmine.any(String));
        expect(resultObj).toBe(val2resObj[1]);

        // checking array
        let val2resArr = val2res[3];
        let resultArr = consoleAppender.format(val2resArr[0]);
        expect(resultArr).toEqual(jasmine.any(String));
        expect(resultArr).toBe(val2resArr[1]);

        // checking number
        let val2resNum = val2res[4];
        let resultNum = consoleAppender.format(val2resNum[0]);
        expect(resultNum).toEqual(jasmine.any(String));
        expect(resultNum).toBe(val2resNum[1]);
    });

    it("check getting log method by level", () => {
        const ca = new ConsoleAppender({
            level: DEFAULT_LEVEL,
        });
        expect(ca.__getConsoleMethod(LOG_LEVEL.emerg)).toBe(console.trace);
        expect(ca.__getConsoleMethod(LOG_LEVEL.alert)).toBe(console.trace);
        expect(ca.__getConsoleMethod(LOG_LEVEL.crit)).toBe(console.trace);
        expect(ca.__getConsoleMethod(LOG_LEVEL.error)).toBe(console.error);
        expect(ca.__getConsoleMethod(LOG_LEVEL.warn)).toBe(console.warn);
        expect(ca.__getConsoleMethod(LOG_LEVEL.notice)).toBe(console.info);
        expect(ca.__getConsoleMethod(LOG_LEVEL.info)).toBe(console.info);
        expect(ca.__getConsoleMethod(LOG_LEVEL.debug)).toBe(console.debug);
    });

    it("check logging", () => {
        const ca = new ConsoleAppender({
            level: DEFAULT_LEVEL
        });

        const payload = {
            message: "hello world",
            level: LOG_LEVEL.emerg
        };
        ca.log = jasmine.createSpy("log");
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.alert;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.crit;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.error;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.warn;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.notice;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.info;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);

        payload.level = LOG_LEVEL.debug;
        ca.log(payload);
        expect(ca.log).toHaveBeenCalledWith(payload);
    });
});