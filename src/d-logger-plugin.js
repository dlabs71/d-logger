import $log from './d-logger.js';

export default {
    install(Vue, opt) {
        if (!!opt && !!opt.logConfig) {
            $log.configure(opt.logConfig);
        }
        Vue.prototype.$log = $log;
    },
};
