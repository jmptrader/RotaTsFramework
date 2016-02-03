//#region Imports
import {ILoaderConfig, ILoader, ILoaderSettings} from './loader.interface';
import {IRouteConfig} from "./routing.interface";

import './loader.config';
//#endregion

/**
 * Controller File Loader Service
 */
class Loader implements ILoader {
    //#region Props
    serviceName: string = "Loader Service";
    //states
    static $inject = ['LoaderConfig', 'RouteConfig'];
    constructor(private loaderconfig: ILoaderConfig, private routeconfig: IRouteConfig) {
    }
    /**
     * Generate file path depending on provided settings and general settings
     * @param settings Settings
     */
    generatePath(settings: ILoaderSettings): string {
        let relativePath = settings.controllerUrl;
        if (!relativePath && (settings.useTemplateUrlPath || this.loaderconfig.useTemplateUrlPath)) {
            relativePath = settings.templateUrl.replace('.html', '.controller.js');
        }
        const controllerFullName = this.routeconfig.baseUrl + relativePath;
        return controllerFullName;
    }
    /**
     * Returns inline annotated function array for the loaded file
     * @param settings Settings
     */
    resolve(settings: ILoaderSettings): { [index: string]: any[] } {
        var fileFullPath = this.generatePath(settings);
        //file resolve
        return {
            //lazy loading promise
            load: ['$q', '$rootScope', ($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
                var defer = $q.defer();
                require([fileFullPath], () => {
                    defer.resolve();
                    $rootScope.$apply();
                });
                return defer.promise;
            }]
        };
    }
}
//#region Register
var module: ng.IModule = angular.module('rota.loader.service', ['rota.loader.config']);
module.service('Loader', Loader);
//#endregion

export {Loader, ILoader, ILoaderSettings};