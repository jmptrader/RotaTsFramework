import {IMainConfig}  from "../config/config.interface";
import {IBaseApi} from './interfaces';
import {ICommon} from "../services/common.interface";

class BaseApi implements IBaseApi {
    $rootScope: ng.IRootScopeService;
    $q: angular.IQService;
    $http: ng.IHttpService;
    common:ICommon;
    config: IMainConfig;

    constructor(bundle: { [s: string]: any; }, ...args: any[]) {
        this.initBundle(bundle);
    }

    initBundle(bundle: { [s: string]: any; }): void {
        this.$rootScope = bundle['$rootScope'];
        this.$q = bundle['$q'];
        this.$http = bundle['$http'];
        this.config = bundle['config'];
        this.common = bundle['common'];
    }

    get<T>(url: string, params?: any): angular.IPromise<T> {
        return this.$http.get(this.config.defaultApiUrl + url, params)
            .then((response: ng.IHttpPromiseCallbackArg<T>): T=> {
                return response.data;
            });
    }

    post<T>(url: string, params: any = {}): angular.IPromise<T> {
        return this.$http.post(this.config.defaultApiUrl + url, params)
            .then((response: ng.IHttpPromiseCallbackArg<T>): T=> {
                return response.data;
            });
    }
}

export {BaseApi, IBaseApi}