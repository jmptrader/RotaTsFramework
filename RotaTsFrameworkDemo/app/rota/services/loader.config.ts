//#region Import
import { ILoaderConfig } from "./loader.interface";
import { BaseConfig } from "../base/baseconfig";

//#endregion

//#region RouteConfig
class LoaderConfig extends BaseConfig<ILoaderConfig> {
    constructor() {
        //set default values
        var config: ILoaderConfig = {};
        config.useBaseUrl =
            config.useTemplateUrlPath = true;
        this.config = config;
        super();
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.loader.config', []);
module.provider('LoaderConfig', LoaderConfig);
//#endregion

export {LoaderConfig, ILoaderConfig}