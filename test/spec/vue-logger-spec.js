import Vue from 'vue';
import DLoggerPlugin, {$log} from '../../src/index.js';

describe("vue.js logger", () => {

    Vue.use(DLoggerPlugin);
    const vm = new Vue();
    const str = 'd-logger it`s work';


    it("level error", () => {
        expect(vm.$log.error).toBeDefined()
        spyOn(vm.$log, "error").and.callThrough();
        vm.$log.error(str);
        expect(vm.$log.error).toHaveBeenCalledWith(str);
    });

    it("level warning", () => {
        expect(vm.$log.warning).toBeDefined()
        spyOn(vm.$log, "warning").and.callThrough();
        vm.$log.warning(str);
        expect(vm.$log.warning).toHaveBeenCalledWith(str);
    });

    it("level info", () => {
        expect(vm.$log.info).toBeDefined()
        spyOn(vm.$log, "info").and.callThrough();
        vm.$log.info(str);
        expect(vm.$log.info).toHaveBeenCalledWith(str);
    });

    it("level debug", () => {
        expect(vm.$log.debug).toBeDefined()
        spyOn(vm.$log, "debug").and.callThrough();
        vm.$log.debug(str);
        expect(vm.$log.debug).toHaveBeenCalledWith(str);
    });
});