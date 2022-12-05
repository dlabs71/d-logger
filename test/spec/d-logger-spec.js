import {DLogger, LogAppender} from "../../src/index.js";
import {LOG_LEVEL} from "../../src/constants.js";
import {createLogDir} from "../helpers/fs-helper.js";

const LOG_DIR = "test/spec/log-d-logger-spec";

describe("testing d-logger", () => {
    beforeEach(() => {
        createLogDir(LOG_DIR);
    });

    it("test stepInStack", () => {
        let logger = new DLogger({
            level: "debug",
            stepInStack: 5
        });
        logger.debug("test message");
    });

    it("test __defineLogMethods", () => {
        let logger = new DLogger();
        Object.keys(LOG_LEVEL).forEach(item => {
            expect(logger[item]).toBeDefined();
        })
    });

    it("test clearAppenders", () => {
        let logger = new DLogger();
        logger.clearAppenders();
        expect(logger.config.appenders.length).toBe(0);
    });

    xit("test addFileAppender", () => {
        let logger = new DLogger();
        logger.clearAppenders();
        logger.addFileAppender(LOG_DIR, true);
        expect(logger.config.appenders.length).toBe(1);
    });

    xit("test existFileAppender and getFileAppenders", () => {
        let logger = new DLogger();
        logger.addFileAppender(LOG_DIR, true);
        expect(logger.existFileAppender()).toBeTrue();
        logger.addFileAppender(LOG_DIR, true, "app2");
        expect(logger.getFileAppenders().length).toBe(2);
        logger.clearAppenders();
        expect(logger.existFileAppender()).toBeFalse();
    });

    it("test addConsoleAppender", () => {
        let logger = new DLogger();
        logger.clearAppenders();
        expect(logger.config.appenders.length).toBe(0);
        logger.addConsoleAppender("debug");
        expect(logger.config.appenders.length).toBe(1);
    });

    it("test addCustomAppender", () => {
        let logger = new DLogger();
        logger.clearAppenders();
        expect(logger.config.appenders.length).toBe(0);

        class CustomAppender extends LogAppender {

            constructor() {
                super({});
            }

            log(strings, level = null, stepInStack = null) {
                const message = this.creatingMessage(strings, level, stepInStack);
                // реализация данного метода
                return message
            }
        }

        logger.addCustomAppender(new CustomAppender());
        expect(logger.config.appenders.length).toBe(1);
    });

    it("test logProcessEnvs", () => {
        let logger = new DLogger();
        spyOn(logger, "logProcessEnvs").and.callThrough();
        logger.logProcessEnvs();
        expect(logger.logProcessEnvs).toHaveBeenCalled();
    });
});