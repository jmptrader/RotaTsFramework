//#region Import
import { ILoggerConfig, LogType } from "./logger.interface";
import { BaseConfig } from "../base/baseconfig";
import * as toastr from "toastr";

//#endregion

//#region RouteConfig
class LoggerConfig extends BaseConfig<ILoggerConfig> {
    constructor() {
        //$Log service enabled
        this.config.debugEnabled = true;
        //toastr common settings
        toastr.options.timeOut = 2000;
        toastr.options.positionClass = 'toast-bottom-right';
        //timeout durations
        this.config.timeOuts[LogType.Warn] = 4000;
        this.config.timeOuts[LogType.Error] = 5000;
        this.config.timeOuts[LogType.Info] = 3000;
        this.config.timeOuts[LogType.Success] = 3000;
        this.config.timeOuts[LogType.Debug] = 6000;
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.log.config', []);
module.provider('LoggerConfig', LoggerConfig);
//#endregion

export {LoggerConfig, ILoggerConfig}