//#region Import
import { ILoaderConfig } from "./loader.interface";
import { BaseConfig } from "../base/baseconfig";

//#endregion

//#region RouteConfig
class LoaderConfig extends BaseConfig<ILoaderConfig> {
    constructor() {
        //set default values
        this.config.useBaseUrl =
            this.config.useTemplateUrlPath = true;
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.routing.config', []);
module.provider('LoaderConfig', LoaderConfig);
//#endregion

export {LoaderConfig, ILoaderConfig}