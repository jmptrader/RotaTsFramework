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

    private static defaultControllerSystemDependencies = ['$rootScope', '$scope', '$q', '$http', '$window', '$stateParams'];
    private static defaultControllerDependencies = ['Logger', 'Common', 'Dialogs', 'Routing', 'Config', 'Localization'];
    //#endregion

    constructor(moduleName: string) {
        this.rotaModule = angular.module(moduleName, ["rota"]);

        //TODO:annotation injection
        this.configure(($controllerProvider: ng.IControllerProvider, $provide: angular.auto.IProvideService) => {
            this.controllerProvider = $controllerProvider;
            this.provideService = $provide;
        });
    }
    /**
     * Add controller with dependencies
     * @param controllerName Controller name
     * @param controller Controller instance
     * @param dependencies Dependencies 
     */
    addController(controllerName: string, controller: typeof BaseController, ...dependencies: string[]): void {
        //merge all deps
        const deps = new Array<any>().concat(RotaApp.defaultControllerSystemDependencies,
            RotaApp.defaultControllerDependencies, dependencies || []);
        const controllerCtor: Function = (...args: any[]): BaseController => {
            var bundle: { [s: string]: any; } = {
                '$rootScope': args[0],
                '$scope': args[1],
                '$q': args[2],
                '$http': args[3],
                '$window': args[4],
                '$stateParams': args[5],
                'logger': args[6],
                'common': args[7],
                'dialogs': args[8],
                'routing': args[9],
                'config': args[10],
                'localization': args[11]
            }
            var instance: BaseController = new controller(bundle, args[12]);
            //Instance'i dondur
            return instance;
        }; //Fonksiyonu son obje olarak dizinin sonuna ekle
        deps.push(controllerCtor);
        //Register et
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
}
//Instance of rota app
var rotaApp: IRotaApp = new RotaApp("rota-app");
//Export
export {IRotaApp, rotaApp as App}
