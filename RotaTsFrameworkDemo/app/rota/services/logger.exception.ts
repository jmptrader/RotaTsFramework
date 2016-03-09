//#region Imports
import {IMainConfig} from '../config/config.interface';
import {ILogger, IServerExceptionLog} from './logger.interface';
//deps
import "./logger.service"
//#endregion

//#region Interfaces



//#endregion

//#region Error Logger
const exceptionHandler = ($delegate: ng.IExceptionHandlerService, $injector: ng.auto.IInjectorService, config: IMainConfig) => {
    let loggerService: ILogger;
    let httpService: ng.IHttpService;
    //server logging
    const serverLogger = (exception: IServerExceptionLog): ng.IPromise<any> => {
        httpService = httpService || $injector.get<ng.IHttpService>('$http');
        return httpService({
            method: 'POST',
            url: config.serverExceptionLoggingBackendUrl,
            data: exception,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return (exception: Error, cause?: string) => {
        if (config.debugMode) {
            $delegate(exception, cause);
        } else {
            if (config.serverExceptionLoggingEnabled) {
                try {
                    serverLogger(exception);
                } catch (e) { }
            }
        };
        loggerService = loggerService || $injector.get<ILogger>('Logger');
        //toastr and notification log
        loggerService.toastr.error({ message: exception.message });
        loggerService.notification.error({ message: exception.message });
    };
};
exceptionHandler.$inject = ['$delegate', '$injector', 'Config'];
//#endregion

//#region Register
const module = angular.module('rota.services.log');
module.config(['$provide', ($provide: angular.auto.IProvideService) => {
    $provide.decorator('$exceptionHandler', exceptionHandler);
}]);
//#endregion