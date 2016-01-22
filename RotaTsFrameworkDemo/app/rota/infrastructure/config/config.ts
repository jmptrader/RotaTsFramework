import { IBaseConfig, BaseConfig } from "../base/baseconfig";


interface IMainConfig extends IBaseConfig {
    baseUrl?: string;
    appVersion?: string;
    appTitle?: string;
}

class Config extends BaseConfig<IMainConfig> {
    constructor() {
        this.config.appVersion = '1.0.0';
        this.config.appTitle = 'Bimar App';
        super();
    }
}

//#region Register
var module: ng.IModule = angular.module('rota.config', []);
module.provider('Config', Config);
//#endregion

export {Config, IMainConfig}
