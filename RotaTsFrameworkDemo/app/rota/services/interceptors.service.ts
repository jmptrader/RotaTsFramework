//#region Imports
import {IMainConfig} from '../config/config.interface';
import {ILogger} from './logger.interface';
//#endregion

//#region Request Tracker
var httpRequestTrackerService = ($q: ng.IQService,
    $location: ng.ILocationService,
    $rootScope: ng.IRootScopeService,
    $timeout: ng.ITimeoutService,
    config: IMainConfig) => {

    const delayInterval: number = 800;
    var queue = [];
    var timerPromise: ng.IPromise<any>;
    var timerPromiseHide: ng.IPromise<any>;

    var processRequest = () => {
        queue.push({});
        if (queue.length === 1) {
            timerPromise = $timeout(() => {
                if (queue.length) {
                    $rootScope.$broadcast(config.eventNames.ajaxStarted);
                }
            }, delayInterval);
        }
    }

    var processResponse = () => {
        queue.pop();
        if (queue.length === 0) {
            //Since we don't know if another XHR request will be made, pause before
            //hiding the overlay. If another XHR request comes in then the overlay
            //will stay visible which prevents a flicker
            timerPromiseHide = $timeout(() => {
                //Make sure queue is still 0 since a new XHR request may have come in
                //while timer was running
                if (queue.length === 0) {
                    $rootScope.$broadcast(config.eventNames.ajaxFinished);
                    if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                }
            }, delayInterval);
        }
    }

    return {
        request: config => {
            if (config.showSpinner === undefined || config.showSpinner)
                processRequest();
            return config || $q.when(config);
        },
        response: response => {
            processResponse();
            return response || $q.when(response);
        },
        responseError: rejection => {
            processResponse();
            return $q.reject(rejection);
        }
    };
}
httpRequestTrackerService.$inject = ['$q', '$location', '$rootScope', '$timeout', 'Config'];
//#endregion

//#region Request Error Tracker
var errorHttpInterceptorService = ($q: ng.IQService, logger: ILogger) => {
    return {
        responseError: response => {
            //TODO:will be implemented !!
            if (response.status === 400) {
                // log(response.statusText, response.data);
                return $q.reject(response);
            } else if (response.status === 0) {
                if (response.config.logging === undefined || response.config.logging) {
                    logger.notification.error({ message: 'Server connection lost' });
                }
                return $q.reject(response);
            }
            return $q.reject(response);
        }
    };
}
errorHttpInterceptorService.$inject = ['$q', 'Logger'];
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.services.httpRequestTracker', []);
module.factory('httpAjaxInterceptor', httpRequestTrackerService)
    .factory('errorHttpInterceptor', errorHttpInterceptorService)
    .config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
        //TODO:Antiforgerytoken will be implemeted
        //$httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
        //$httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

        $httpProvider.interceptors.push('errorHttpInterceptor');
        $httpProvider.interceptors.push('httpAjaxInterceptor');
    }]);
//#endregion
