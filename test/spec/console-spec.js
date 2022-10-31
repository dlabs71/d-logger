import {$log} from '../../src/index.js';

describe("$log using console appender", () => {
    const str = 'd-logger it`s work';

    it("level error", () => {
        expect($log.error).toBeDefined()
        spyOn($log, "error").and.callThrough();
        $log.error(str);
        expect($log.error).toHaveBeenCalledWith(str);
    });

    it("level warning", () => {
        expect($log.warning).toBeDefined()
        spyOn($log, "warning").and.callThrough();
        $log.warning(str);
        expect($log.warning).toHaveBeenCalledWith(str);
    });

    it("level info", () => {
        expect($log.info).toBeDefined()
        spyOn($log, "info").and.callThrough();
        $log.info(str);
        expect($log.info).toHaveBeenCalledWith(str);
    });

    it("level debug", () => {
        expect($log.debug).toBeDefined()
        spyOn($log, "debug").and.callThrough();
        $log.debug(str);
        expect($log.debug).toHaveBeenCalledWith(str);
    });
});