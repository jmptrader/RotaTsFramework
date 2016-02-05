import {IMainConfig}  from "../config/config.interface";
import {IBaseApi} from './interfaces';


class BaseApi implements IBaseApi {
    $rootScope: ng.IRootScopeService;
    $q: angular.IQService;
    $http: ng.IHttpService;

    config: IMainConfig;

    constructor(bundle: { [s: string]: any; }, ...args: any[]) {
        this.initBundle(bundle);
    }

    initBundle(bundle: { [s: string]: any; }): void {
        this.$rootScope = bundle['$rootScope'];
        this.$q = bundle['$q'];
        this.$http = bundle['$http'];
        this.config = bundle['config'];
    }

    get<T>(url: string, params?: any): angular.IPromise<T> {
        return this.$http.get(this.config.baseUrl + url, params)
            .then((response: ng.IHttpPromiseCallbackArg<T>): T=> {
                return response.data;
            });
    }

    post<T>(url: string, params: any = {}): angular.IPromise<T> {
        return this.$http.post(this.config.baseUrl + url, params)
            .then((response: ng.IHttpPromiseCallbackArg<T>): T=> {
                return response.data;
            });
    }
}

export {BaseApi, IBaseApi}