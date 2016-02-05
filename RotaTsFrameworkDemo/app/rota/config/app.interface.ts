import {BaseController} from '../base/basecontroller';
import {BaseApi} from '../base/baseapi';

interface IRotaApp {
    rotaModule: ng.IModule;
    addController(controllerName: string, controller: typeof BaseController, dependencies?: string[]): void;
    addApi(apiName: string, api: typeof BaseApi, dependencies?: string[]): void;
    configure(fn: Function): IRotaApp;
    configure(fn: any[]): IRotaApp;
    run(fn: Function): IRotaApp;
    run(fn: any[]): IRotaApp;
}

export {IRotaApp}