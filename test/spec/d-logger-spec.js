import {DLogger, LogAppender, LOG_LEVEL} from "../../src/index.js";

describe("testing d-logger", () => {

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

            log(strings, level = null, stepInStack = null, dateL10n= null) {
                const message = this.creatingMessage(strings, level, stepInStack, dateL10n);
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