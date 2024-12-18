import {dlog} from '../../src/index.js';

describe("declarative logger", () => {
    const str = 'd-logger it`s work';

    it("level error", () => {
        expect(dlog.error).toBeDefined()
        spyOn(dlog, "error").and.callThrough();
        dlog.error(str);
        expect(dlog.error).toHaveBeenCalledWith(str);
    });

    it("level warning", () => {
        expect(dlog.warning).toBeDefined()
        spyOn(dlog, "warning").and.callThrough();
        dlog.warning(str);
        expect(dlog.warning).toHaveBeenCalledWith(str);
    });

    it("level info", () => {
        expect(dlog.info).toBeDefined()
        spyOn(dlog, "info").and.callThrough();
        dlog.info(str);
        expect(dlog.info).toHaveBeenCalledWith(str);
    });

    it("level debug", () => {
        expect(dlog.debug).toBeDefined()
        spyOn(dlog, "debug").and.callThrough();
        dlog.debug(str);
        expect(dlog.debug).toHaveBeenCalledWith(str);
    });
});