import {BaseController} from '../base/basecontroller';
import {IBaseModel} from '../base/interfaces';
import {BaseApi} from '../base/baseapi';

interface IRotaApp {
    rotaModule: ng.IModule;
    /**
    * Add controller with dependencies
    * @param controllerName Controller name
    * @param controller Controller instance
    * @param dependencies Dependencies 
    */
    addController(controllerName: string, controller: typeof BaseController, ...dependencies: string[]): void;
    addApi(apiName: string, api: typeof BaseApi, dependencies?: string[]): void;
    addValue<TModel extends IBaseModel>(serviceName: string, service: TModel): void;
    configure(fn: Function): IRotaApp;
    configure(fn: any[]): IRotaApp;
    run(fn: Function): IRotaApp;
    run(fn: any[]): IRotaApp;
}

export {IRotaApp}