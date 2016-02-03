//#region Import
import { ILoggerConfig, LogType } from "./logger.interface";
import { BaseConfig } from "../base/baseconfig";
import * as toastr from "toastr";
import * as angular from "angular";

//#endregion

//#region RouteConfig
class LoggerConfig extends BaseConfig<ILoggerConfig> {
    constructor() {
        var config: ILoggerConfig = {}; 
        //$Log service enabled
        config.debugEnabled = true;
        //toastr common settings
        toastr.options.timeOut = 2000;
        toastr.options.positionClass = 'toast-bottom-right';
        //timeout durations
        config.timeOuts = {};
        config.timeOuts[LogType.Warn] = 4000;
        config.timeOuts[LogType.Error] = 5000;
        config.timeOuts[LogType.Info] = 3000;
        config.timeOuts[LogType.Success] = 3000;
        config.timeOuts[LogType.Debug] = 6000;

        this.config = config;
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.log.config', []);
module.provider('LoggerConfig', LoggerConfig);
//#endregion

export {LoggerConfig, ILoggerConfig}