import { IBaseConfig, BaseConfig } from "../base/baseconfig";
import * as angular from "angular";

interface IEvents {
    userLoginChanged: string;
    loginRequired: string;
    ajaxStarted: string;
    ajaxFinished: string;
    menuChanged: string;
    badgeChanged: string;
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
        var config: IMainConfig = {};
        config.appVersion = '1.0.0';
        config.appTitle = 'Bimar App';
        config.debugMode = true;
        config.eventNames = {
            userLoginChanged: 'userLoginChanged',
            ajaxFinished: 'ajaxFinished',
            ajaxStarted: 'ajaxStarted',
            loginRequired: 'loginRequired',
            menuChanged: 'menuChanged',
            badgeChanged: 'badgeChanged'
        }
        this.config = config;
        super();
    }
}

//#region Register
var module: ng.IModule = angular.module('rota.config', []);
module.provider('Config', Config);
//#endregion

export {Config, IMainConfig}
