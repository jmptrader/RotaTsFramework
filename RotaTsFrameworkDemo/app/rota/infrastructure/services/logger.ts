
interface ILogger {
    log(msg: string): void;
    error(msg: string): void;
    warn(msg: string): void;
    success(msg: string): void;
}

class Logger implements ILogger {
    constructor() {

    }

    log(msg: string): void {
        console.log(msg);
    }

    error(msg: string): void {
        console.error(msg);
    }

    warn(msg: string): void {
        console.warn(msg);
    }

    success(msg: string): void {
        console.info(msg);
    }
}

//#region Register
var module: ng.IModule = angular.module('rota.log.service', []);

module.service('Logger', Logger);

export {ILogger, Logger}

//#endregion