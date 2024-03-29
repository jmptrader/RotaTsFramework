﻿//#region Imports
import {IBaseApi, BaseApi} from "../base/baseapi";
import {IRotaApp} from './app.interface';
import {IBundle, IBaseModel} from '../base/interfaces';
import {IMainConfigProvider} from './config.interface';
//deps
import {BaseController} from '../base/basecontroller';
import {BaseModalController} from '../base/basemodalcontroller';
import "./infrastructure.index"
import {Dialogs} from '../services/dialogs.service';
//#endregion

class RotaApp implements IRotaApp {
    //#region Props
    rotaModule: angular.IModule;
    private controllerProvider: angular.IControllerProvider;
    private provideService: angular.auto.IProvideService;
    //#endregion

    //#region Init
    constructor(moduleName: string) {
        this.rotaModule = angular.module(moduleName, ["rota"]);

        this.configure(['$compileProvider', '$controllerProvider', '$provide', 'ConfigProvider',
            ($compileProvider: ng.ICompileProvider, $controllerProvider: ng.IControllerProvider,
                $provide: angular.auto.IProvideService, configProvider: IMainConfigProvider) => {
                this.controllerProvider = $controllerProvider;
                this.provideService = $provide;
                //remove debug info in prod
                if (!configProvider.config.debugMode) {
                    $compileProvider.debugInfoEnabled(false);
                }
            }]);
        //add base modal controller if not defined controller
        this.rotaModule.controller(Dialogs.defaultModalControllerName,
            this.createControllerAnnotation(BaseModalController));
    }
    //#endregion

    //#region App Methods
    /**
     * Add controller with dependencies
     * @param controllerName Controller name
     * @param controller Controller instance
     * @param dependencies Dependencies 
     */
    addController(controllerName: string, controller: typeof BaseController, ...dependencies: string[]): void {
        const controllerAnnotation = this.createControllerAnnotation(controller, dependencies);
        //register
        this.controllerProvider.register(controllerName, controllerAnnotation);
    }
    /**
     * Create controller annotation style of contructor function
     * @param controller Controller type to register
     * @param dependencies Optional services depended
     */
    private createControllerAnnotation(controller: typeof BaseController, dependencies: string[] = []): any[] {
        const deps = new Array<any>().concat(controller.injects, dependencies);
        const controllerCtor: Function = (...args: any[]): BaseController => {
            const bundle: IBundle = {
                customBundles: {},
                systemBundles: {}
            }
            const systemServices = args.slice(0, args.length - dependencies.length);
            const customServices = args.slice(systemServices.length, args.length);

            systemServices.forEach((service: any, index: number) => {
                const serviceName = controller.injects[index];
                bundle.systemBundles[serviceName.toLowerCase()] = service;
            });
            customServices.forEach((service: any, index: number) => {
                const serviceName = dependencies[index];
                bundle.customBundles[serviceName] = service;
            });

            const instance = new controller(bundle);
            return instance;
        };
        //add ctor
        deps.push(controllerCtor);
        return deps;
    }

    addApi(apiName: string, api: typeof BaseApi, dependencies?: string[]): void {
        //Built-in dependencies - Ek dependencies ile birleştiriliyor
        const deps: any[] = ['$rootScope', '$q', '$http', 'Config', 'Common'].concat(dependencies || []);
        const apiCtor: Function = (...args: any[]): IBaseApi => {
            var bundle: { [s: string]: any; } = {
                '$rootScope': args[0],
                '$q': args[1],
                '$http': args[2],
                'config': args[3],
                'common': args[4]
            }
            var instance: IBaseApi = new api(bundle, args[5]);
            //Instance'i dondur
            return instance;
        }; //Fonksiyonu son obje olarak dizinin sonuna ekle
        deps.push(apiCtor);
        //Register et
        this.provideService.service(apiName, deps);
    }

    addValue<TModel extends IBaseModel>(serviceName: string, service: TModel): void {
        this.provideService.value(serviceName, service);
    }

    configure(fn: any): IRotaApp {
        this.rotaModule.config(fn);
        return this;
    }

    run(fn: any): IRotaApp {
        this.rotaModule.run(fn);
        return this;
    }

    //#endregion
}
//Instance of rota app
var rotaApp: IRotaApp = new RotaApp("rota-app");
//Export
export {rotaApp as App}
