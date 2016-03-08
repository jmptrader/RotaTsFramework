//#region Imports
import {IMainConfig} from '../config/config.interface';
import {ILogger} from './logger.interface';
//deps
import "./logger.service"
//#endregion

//#region Error Logger
const exceptionHandler = ($delegate: ng.IExceptionHandlerService, $injector: ng.auto.IInjectorService, config: IMainConfig) => {
    let logger: ILogger;
    return (exception, cause) => {
        if (config.debugMode) {
            $delegate(exception, cause);
        } else {
            if (config.elmahLoggingEnabled) {
                try {
                    //elmahLog(exception);
                } catch (e) { }
            }
        };
        //Log Message
        logger = logger || $injector.get<ILogger>('Logger');
        logger.toastr.error({ message: exception.message });
        logger.notification.error({ message: exception.message });
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