//#region Imports
import {ILogger, IBaseLogger} from "../services/logger.interface";
import {ICommon} from "../services/common.interface";
import {IRotaRootScope} from "../services/common.interface";
import {IDialogs} from '../services/dialogs.interface';
import {IBundle} from './interfaces';
import {IMainConfig} from '../config/config.interface';
import {IRouting} from '../services/routing.interface';
import {ILocalization} from '../services/localization.interface';
//#endregion

//#region BaseController
class BaseController {
    //#region Props
    //services
    protected $rootScope: IRotaRootScope;
    protected $q: ng.IQService;
    protected $http: ng.IHttpService;
    protected $scope: ng.IScope;
    protected $window: ng.IWindowService;
    protected $stateParams: ng.ui.IStateParamsService;
    protected logger: ILogger;
    protected common: ICommon;
    protected dialogs: IDialogs;
    protected config: IMainConfig;
    protected routing: IRouting;
    protected localization: ILocalization;
    //shortcuts for loggers
    get notification(): IBaseLogger { return this.logger.notification; }
    get toastr(): IBaseLogger { return this.logger.toastr; }
    get console(): IBaseLogger { return this.logger.console; }
    //registered events for off methods while scope destroying
    protected registeredEvents: Function[];
    //#endregion

    constructor(bundle: IBundle, ...args: any[]) {
        this.initBundle(bundle);
        this.registerEvents();
    }

    initBundle(bundle: IBundle): void {
        this.$rootScope = bundle['$rootScope'];
        this.$q = bundle['$q'];
        this.$scope = bundle['$scope'];
        this.$http = bundle['$http'];
        this.logger = bundle["logger"];
        this.common = bundle["common"];
        this.dialogs = bundle["dialogs"];
        this.$stateParams = bundle["$stateParams"];
        this.$window = bundle["$window"];
        this.config = bundle["config"];
        this.routing = bundle["routing"];
        this.localization = bundle["localization"];
    }

    registerEvent(eventName: string, fn: () => void): void {
        const offFn = this.$scope.$on(eventName, fn);
        this.registeredEvents.push(offFn);
    }

    registerEvents(): void {
        this.registeredEvents = [];
        this.registerEvent("$destroy", this.destroy);
    }

    destroy(): void {
        //this.registeredEvents.forEach(fn => {
        //    fn();
        //});
        //this.registeredEvents = [];
    }
}
//#endregion

export {BaseController}

