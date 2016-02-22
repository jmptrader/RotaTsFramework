//#region Imports
import {ILocalization, IResource} from "./localization.interface";
import {ICaching} from "./caching.interface";
//deps - resource files
import * as rotaresource from 'i18n!rota-resources/nls/resources';
import * as appresource from 'i18n!app-resources/nls/resources';
//#endregion

//#region Localization Service
class Localization implements ILocalization {
    serviceName = "Localization Service";
    static activeLanguageCacheName = "active.language";

    private _currentLanguage: string;
    /**
    * Gets current language code,Default 'tr-tr'
    * @returns {string} 
    */
    get currentLanguage(): string { return this._currentLanguage || 'tr-tr'; }
    /**
     * Change current language and reload page
     * @param value Language to change
     */
    set currentLanguage(value: string) {
        if (value === this.currentLanguage) return;
        this.$window.localStorage.setItem(Localization.activeLanguageCacheName, value);
        this.$window.location.reload();
    }

    static $inject = ['$interpolate', '$window', 'Resource'];
    constructor(private $interpolate: ng.IInterpolateService, private $window: ng.IWindowService,
        private resources: IResource) {
        this._currentLanguage = $window.localStorage.getItem(Localization.activeLanguageCacheName);
    }

    getLocal(key: string): string;
    getLocal(key: string, ...params: string[]): string;
    getLocal(key: string, scope: any): string;
    getLocal(...args: any[]): string {
        //if no param provided return with null
        if (args.length === 0) return null;
        //get first param as ket value
        const key = <string>args[0];
        //get localized value
        let tag = this.getLocalizedValue(key);
        //format
        if (args.length > 1) {
            //interpolation
            if (angular.isObject(args[1])) {
                tag = this.$interpolate(tag)(args[1]);
            } else {
                //format
                for (let index = 1; index < args.length; index++) {
                    const target = '{' + (index - 1) + '}';
                    tag = tag.replace(target, args[index]);
                }
            }
        }
        return tag;
    }
    /**
     * Get localized string fro the key path
     * @param path Key
     * @returns {string}
     */
    private getLocalizedValue(path: string): string {
        const keys = path.split(".");
        var level = 0;
        const extractValue = (context: IResource): string => {
            if (context[keys[level]]) {
                const val = context[keys[level]];
                if (typeof val === 'string') {
                    return val;
                } else {
                    level++;
                    return extractValue(val);
                }
            } else {
                return null;
            }
        };
        return extractValue(this.resources);
    }
}

//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.services.localization', []);
module.service('Localization', Localization);
module.factory('Resource', () => {
    return angular.extend({}, appresource, rotaresource);
});
//#endregion

export {Localization}