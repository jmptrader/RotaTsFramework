interface ICommon {
    promise<T>(p?: any): ng.IPromise<T>;
    rejectedPromise(reason?: any): ng.IPromise<any>;
    makePromise<T>(value: any): ng.IPromise<T>;
    isPromise(value: any): boolean;
}
class Common {
    static $inject = ['$q'];
    constructor(private $q: ng.IQService) { }

    promise<T>(p?: any): ng.IPromise<T> {
        return this.$q.when<T>(p);
    }

    rejectedPromise(reason?: any): ng.IPromise<any> {
        var d = this.$q.defer();
        d.reject(reason);
        return d.promise;
    }

    makePromise<T>(value: any): ng.IPromise<T> {
        return this.isPromise(value) ? value : this.promise<T>(value);
    }

    isPromise(value: any): boolean {
        return value && angular.isFunction(value.then);
    }
}

var module: ng.IModule = angular.module('rota.misc.common', [])
    .service('Common', Common);

export {Common, ICommon}