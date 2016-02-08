//#region Imports
import {IMainConfig} from './config.interface';
//deps
import { BaseConfig } from "../base/baseconfig";
import * as angular from "angular";
//#endregion

//#region Config
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
        config.gridDefaultPageSize = 25;
        config.gridDefaultOptionsName = 'vm.gridOptions';
        this.config = config;
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.config', []);
module.provider('Config', Config);
//#endregion

export {Config, IMainConfig}
