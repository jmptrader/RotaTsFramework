//#region Import
import { IRouteConfig } from "./routing.interface";
import { BaseConfig } from "../base/baseconfig";

//#endregion

//#region RouteConfig
class RouteConfig extends BaseConfig<IRouteConfig> {
    constructor() {
        //TODO:require config baseUrl
        /**
         *  var globalConfigs = requirejs.s.contexts._.config;
                    return globalConfigs.baseUrl;
         */
        this.config.basePath = '';
        this.config.baseUrl = '';
        this.config.shellPath = 'rota/shell/';
        this.config.error404StateUrl = this.config.shellPath + 'error404.html';
        this.config.error500StateUrl = this.config.shellPath + 'error500.html';
        this.config.inactiveStateUrl = '/';
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.routing.config', []);
module.provider('RouteConfig', RouteConfig);
//#endregion

export {RouteConfig, IRouteConfig}