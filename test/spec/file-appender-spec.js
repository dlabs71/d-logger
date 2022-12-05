import fs from "fs";
import {FileAppender} from "../../src/index.js";
import {createLogDir, generateLogFiles} from "../helpers/fs-helper.js";

const LOG_DIR = "test/spec/log-file-appender-spec";
const LOG_PREFIX = "test";
const LEVEL = "debug";

xdescribe("testing file appender", () => {
    beforeEach(() => {
        createLogDir(LOG_DIR);
    });

    it("check rotating files", (done) => {
        createLogDir(LOG_DIR);
        const COUNT_FILES = 10;
        const COUNT_ROTATE_FILES = 5;
        let fileAppender = new FileAppender({
            level: LEVEL,
            directory: LOG_DIR,
            filePrefix: LOG_PREFIX,
            isRotatingFiles: true,
            numberOfFiles: COUNT_ROTATE_FILES
        });
        expect(fileAppender).toBeDefined();
        generateLogFiles(COUNT_FILES, LOG_DIR, LOG_PREFIX);
        expect(fs.readdirSync(LOG_DIR).length).toBe(COUNT_FILES);
        fileAppender.rotateLogFiles().then(() => {
            expect(fs.readdirSync(LOG_DIR).length).toBe(COUNT_ROTATE_FILES);
            done()
        }).catch((err) => {
            done.fail(err);
        });
    });

    it("check format function", () => {
        const fileAppender = new FileAppender({
            level: LEVEL,
            directory: LOG_DIR,
            filePrefix: LOG_PREFIX,
            isRotatingFiles: false
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
        let resultFn = fileAppender.format(val2resFn[0]);
        expect(resultFn).toEqual(jasmine.any(String));
        expect(resultFn).toBe(val2resFn[1]);

        // checking error/exception
        let val2resErr = val2res[1];
        let resultErr = fileAppender.format(val2resErr[0]);
        expect(resultErr).toEqual(jasmine.any(String));
        expect(resultErr).toBe(val2resErr[1]);

        // checking object
        let val2resObj = val2res[2];
        let resultObj = fileAppender.format(val2resObj[0]);
        expect(resultObj).toEqual(jasmine.any(String));
        expect(resultObj).toBe(val2resObj[1]);

        // checking array
        let val2resArr = val2res[3];
        let resultArr = fileAppender.format(val2resArr[0]);
        expect(resultArr).toEqual(jasmine.any(String));
        expect(resultArr).toBe(val2resArr[1]);

        // checking number
        let val2resNum = val2res[4];
        let resultNum = fileAppender.format(val2resNum[0]);
        expect(resultNum).toEqual(jasmine.any(String));
        expect(resultNum).toBe(val2resNum[1]);
    });

    it("checking delete all log files", (done) => {
        const COUNT_FILES = 10;
        const COUNT_ROTATE_FILES = 5;
        let fileAppender = new FileAppender({
            level: LEVEL,
            directory: LOG_DIR,
            filePrefix: LOG_PREFIX,
            isRotatingFiles: true,
            numberOfFiles: COUNT_ROTATE_FILES
        });
        expect(fileAppender).toBeDefined();
        generateLogFiles(COUNT_FILES, LOG_DIR, LOG_PREFIX);
        expect(fs.readdirSync(LOG_DIR).length).toBe(COUNT_FILES);
        fileAppender.formatStoredLogs().then(() => {
            let fileList = fs.readdirSync(LOG_DIR);
            expect(fileList.length).toBe(1);
            done();
        }).catch(err => {
            done.fail(err);
        })
    });

    it("checking logging", (done) => {
        let fileAppender = new FileAppender({
            level: LEVEL,
            directory: LOG_DIR,
            filePrefix: LOG_PREFIX
        });

        let logMessage = "new log message";
        fileAppender.log([logMessage], "error");

        setTimeout(() => {
            let fileData = fs.readFileSync(fileAppender.config.path, "utf-8");
            expect(fileData).toMatch(`${logMessage}`);
            done();
        });
    });
});