import { IBaseConfig, BaseConfig } from "../base/baseconfig";


interface IMainConfig extends IBaseConfig {
    baseUrl: string;
}

class Config extends BaseConfig<IMainConfig> {
}

//#region Register
var module: ng.IModule = angular.module('rota.config', []);
module.provider('Config', Config);
//#endregion

export {Config, IMainConfig}
