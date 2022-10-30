import Vue from 'vue';
import DLoggerPlugin from '../../src/index.js';

describe("this.$log", () => {

    Vue.use(DLoggerPlugin);
    const vm = new Vue();
    const str = 'd-logger it`s work';

    it("level info", () => {
        expect(vm.$log.info).toBeDefined()
        spyOn(vm.$log, "info").and.callThrough();
        vm.$log.info(str)
        expect(vm.$log.info).toHaveBeenCalledWith(str);
    });

    it("level debug", () => {
        expect(vm.$log.debug).toBeDefined()
        spyOn(vm.$log, "debug").and.callThrough();
        vm.$log.debug(str)
        expect(vm.$log.debug).toHaveBeenCalledWith(str);
    });
});