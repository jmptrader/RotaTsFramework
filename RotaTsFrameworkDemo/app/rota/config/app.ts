//#region Imports
import {IBaseApi, BaseApi} from "../base/baseapi";
import {IRotaApp} from './app.interface';
//deps
import {BaseController} from '../base/basecontroller';
import "./infrastructure.index"
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

        //TODO:annotation injection
        this.configure(($controllerProvider: ng.IControllerProvider, $provide: angular.auto.IProvideService) => {
            this.controllerProvider = $controllerProvider;
            this.provideService = $provide;
        });
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
        const deps = new Array<any>().concat(controller.injects, dependencies || []);
        const controllerCtor: Function = (...args: any[]): BaseController => {
            const bundle: { [s: string]: any; } = {}
            //system deps into bundle
            let i: number;
            for (i = 0; i < controller.injects.length; i++) {
                const serviceName = controller.injects[i];
                bundle[serviceName.toLowerCase()] = args[i];
            }
            const instance = new controller(bundle, args[i], args[i + 1], args[i + 2], args[i + 3], args[i + 4]);
            return instance;
        };
        //add ctor
        deps.push(controllerCtor);
        //register
        this.controllerProvider.register(controllerName, deps);
    }

    addApi(apiName: string, api: typeof BaseApi, dependencies?: string[]): void {
        //Built-in dependencies - Ek dependencies ile birleştiriliyor
        const deps: any[] = ['$rootScope', '$q', '$http', 'Config'].concat(dependencies || []);
        const apiCtor: Function = (...args: any[]): IBaseApi => {
            var bundle: { [s: string]: any; } = {
                '$rootScope': args[0],
                '$q': args[1],
                '$http': args[2],
                'config': args[3]
            }
            var instance: IBaseApi = new api(bundle, args[4]);
            //Instance'i dondur
            return instance;
        }; //Fonksiyonu son obje olarak dizinin sonuna ekle
        deps.push(apiCtor);
        //Register et
        this.provideService.service(apiName, deps);
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
export {IRotaApp, rotaApp as App}
