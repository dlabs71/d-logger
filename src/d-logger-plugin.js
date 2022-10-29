import $log from './d-logger';

export default {
    install(Vue, opt) {
        if (!!opt.logConfig) {
            $log.configure(opt.logConfig);
        }
        Vue.prototype.$log = $log;
    }
}
