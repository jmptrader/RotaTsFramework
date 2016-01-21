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
        this.config.baseUrl = "";
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.routing.config', []);
module.provider('RouteConfig', RouteConfig);
//#endregion

export {RouteConfig, IRouteConfig}