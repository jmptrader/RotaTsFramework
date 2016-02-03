import { IBaseConfig, BaseConfig } from "../base/baseconfig";


interface IEvents {
    userLoginChanged: string;
    loginRequired: string;
    ajaxStarted: string;
    ajaxFinished: string;
    menuChanged: string;
}

interface IMainConfig extends IBaseConfig {
    baseUrl?: string;
    appVersion?: string;
    appTitle?: string;
    debugMode?: boolean;
    eventNames?: IEvents;
}

class Config extends BaseConfig<IMainConfig> {
    constructor() {
        this.config.appVersion = '1.0.0';
        this.config.appTitle = 'Bimar App';
        this.config.debugMode = true;
        this.config.eventNames = {
            userLoginChanged: 'userLoginChanged',
            ajaxFinished: 'ajaxFinished',
            ajaxStarted: 'ajaxStarted',
            loginRequired: 'loginRequired',
            menuChanged: 'menuChanged'
        }

        super();
    }
}

//#region Register
var module: ng.IModule = angular.module('rota.config', []);
module.provider('Config', Config);
//#endregion

export {Config, IMainConfig}
