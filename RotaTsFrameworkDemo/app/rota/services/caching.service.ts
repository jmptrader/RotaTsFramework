//#region Imports
import {ICacheable, ICaching} from './caching.interface';
//#endregion

//#region Caching Service
/**
 * Caching service
 */
class Caching implements ICaching {
    serviceName = "Caching Service";

    static $inject = ['$window'];
    constructor(private $window: ng.IWindowService) {
    }
    /**
     * Save to localstorage
     * @param cacheKey cache key
     * @param data data to cache 
     */
    saveToCache(cacheKey: string, data: ICacheable): void {
        const strData: string = JSON.stringify(data);
        this.$window.localStorage.setItem(cacheKey, strData);
    }
    /**
     * Save to sessionstorage
     * @param cacheKey cache key
     * @param data data to cache 
     */
    saveToSession(cacheKey: string, data: ICacheable): void {
        const strData: string = JSON.stringify(data);
        this.$window.sessionStorage.setItem(cacheKey, strData);
    }
    /**
     * Remove cache from localstorage
     * @param cacheKey cache key
     */
    removeCache(cacheKey: string): void {
        this.$window.localStorage.removeItem(cacheKey);
    }
    /**
     * Remove cache from sessionstorage
     * @param cacheKey cache key
     */
    removeSession(cacheKey: string): void {
        this.$window.sessionStorage.removeItem(cacheKey);
    }
    /**
     * Restore from localstorage
     * @param cacheKey cachekey
     */
    restoreFromCache<T extends ICacheable>(cacheKey: string): T {
        let data = this.$window.localStorage.getItem(cacheKey);
        if (data) {
            data = JSON.parse(data);
            return <T>data;
        }
        return null;
    }
    /**
     * Restore from sessionstorage
     * @param cacheKey cachekey
     */
    restoreFromSession<T extends ICacheable>(cacheKey: string): T {
        let data = this.$window.sessionStorage.getItem(cacheKey);
        if (data) {
            data = JSON.parse(data);
            return <T>data;
        }
        return null;
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.misc.caching', []);
module.service('Caching', Caching);
//#endregion
export {ICaching, Caching}