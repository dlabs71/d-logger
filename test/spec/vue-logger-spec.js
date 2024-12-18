import {createApp} from 'vue';
import {DLoggerPlugin} from '../../src/index.js';

describe("vue.js logger", () => {

    const Component = {
        render() {
        }
    };
    const vm = createApp(Component, {});
    vm.use(DLoggerPlugin);

    const str = 'd-logger it`s work';

    it("level error", () => {
        expect(vm.dlog.error).toBeDefined()
        spyOn(vm.dlog, "error").and.callThrough();
        vm.dlog.error(str);
        expect(vm.dlog.error).toHaveBeenCalledWith(str);
    });

    it("level warning", () => {
        expect(vm.dlog.warning).toBeDefined()
        spyOn(vm.dlog, "warning").and.callThrough();
        vm.dlog.warning(str);
        expect(vm.dlog.warning).toHaveBeenCalledWith(str);
    });

    it("level info", () => {
        expect(vm.dlog.info).toBeDefined()
        spyOn(vm.dlog, "info").and.callThrough();
        vm.dlog.info(str);
        expect(vm.dlog.info).toHaveBeenCalledWith(str);
    });

    it("level debug", () => {
        expect(vm.dlog.debug).toBeDefined()
        spyOn(vm.dlog, "debug").and.callThrough();
        vm.dlog.debug(str);
        expect(vm.dlog.debug).toHaveBeenCalledWith(str);
    });
});