//#region Import
import { IRouteConfig } from "./routing.interface";
import { BaseConfig } from "../base/baseconfig";

//#endregion

//#region RouteConfig
class RouteConfig extends BaseConfig<IRouteConfig> {
    constructor() {
        super();
        //TODO:require config baseUrl
        /**
         *  var globalConfigs = requirejs.s.contexts._.config;
                    return globalConfigs.baseUrl;
         */
        var config: IRouteConfig = {};
        config.basePath = '';
        config.baseUrl = '';
        config.shellPath = 'app/rota/shell/views/';
        config.error404StateUrl = config.shellPath + 'error404.html';
        config.error500StateUrl = config.shellPath + 'error500.html';
        config.inactiveStateUrl = '/';
        this.config = config;
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.services.routing.config', []);
module.provider('RouteConfig', RouteConfig);
//#endregion

export {RouteConfig, IRouteConfig}