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
    get notification(): IBaseLogger { return this.logger.notification; }
    get toastr(): IBaseLogger { return this.logger.toastr; }
    get console(): IBaseLogger { return this.logger.console; }
    protected registeredEvents: Function[];
    //#endregion

    //#region Bundle Services
    static injects = ['$rootScope', '$scope', '$window', '$stateParams',
        'Logger', 'Common', 'Dialogs', 'Routing', 'Config', 'Localization'];

    protected $rootScope: IRotaRootScope;
    protected $scope: ng.IScope;
    protected $window: ng.IWindowService;
    protected $stateParams: ng.ui.IStateParamsService;
    protected logger: ILogger;
    protected common: ICommon;
    protected dialogs: IDialogs;
    protected config: IMainConfig;
    protected routing: IRouting;
    protected localization: ILocalization;
    //#endregion

    //#region Init
    constructor(bundle: IBundle, ...args: any[]) {
        this.initBundle(bundle);
        this.registerEvents();
    }

    protected initBundle(bundle: IBundle): void {
        //system
        this.$rootScope = bundle['$rootScope'];
        this.$scope = bundle['$scope'];
        this.$window = bundle["$window"];
        this.$stateParams = bundle["$stateParams"];
        //rota
        this.logger = bundle["logger"];
        this.common = bundle["common"];
        this.dialogs = bundle["dialogs"];
        this.config = bundle["config"];
        this.routing = bundle["routing"];
        this.localization = bundle["localization"];
    }

    //#endregion

    //#region BaseController Methods
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

    //#endregion

}
//#endregion

export {BaseController}

