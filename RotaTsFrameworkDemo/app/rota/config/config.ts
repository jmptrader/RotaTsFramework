//#region Imports
import {IMainConfig} from './config.interface';
//deps
import { BaseConfig } from "../base/baseconfig";
import * as angular from "angular";
//#endregion

//#region Config
class Config extends BaseConfig<IMainConfig> {
    constructor() {
        const config: IMainConfig = {
            appVersion: '1.0.0',
            appTitle: 'Bimar App',
            debugMode: true,
            defaultApiUrl: '/api/',
            eventNames: {
                userLoginChanged: 'userLoginChanged',
                ajaxFinished: 'ajaxFinished',
                ajaxStarted: 'ajaxStarted',
                loginRequired: 'loginRequired',
                menuChanged: 'menuChanged',
                badgeChanged: 'badgeChanged'
            },
            gridDefaultPageSize: 25,
            gridDefaultOptionsName: 'vm.gridOptions',
            supportedLanguages: [{ code: 'tr-tr', fullname: 'Türkçe' }, { code: 'en-us', fullname: 'English' }]
        };
        this.config = config;
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.config', []);
module.provider('Config', Config);
//#endregion

export {Config}
