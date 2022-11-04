import $log from './d-logger.js';

export default {

    /**
     * Vue.js plugin for include d-logger to you application
     * @param Vue - Vue instance
     * @param opt - options.
     * Option can contain configuration for the DLogger {@see DLogger} class. They must be in opt.logConfig.
     * Config parameters:
     * appenders - list appender
     * level - log level threshold. By default - debug {@see LOG_LEVEL}.
     *         Log level can also be specified with one of the following images:
     *              - define process env: process.env.D_LOGGER_LOG_LEVEL
     *              - define process env: process.env.VUE_APP_D_LOGGER_LOG_LEVEL
     *              - define process arg: --debug-mode (process.argv.includes('--debug-mode'))
     * template - default function for templating log row
     */
    install(Vue, opt) {
        if (!!opt && !!opt.logConfig) {
            $log.configure(opt.logConfig);
        }
        Vue.prototype.$log = $log;
    },
};
