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
    rtForm: ng.IFormController;
    /**
     * Notification Service
     * @returns {IBaseLogger}
     */
    get notification(): IBaseLogger { return this.logger.notification; }
    /**
     * Toastr Service
     * @returns {IBaseLogger}
     */
    get toastr(): IBaseLogger { return this.logger.toastr; }
    /**
     * Console Service
     * @returns {IBaseLogger}
     */
    get console(): IBaseLogger { return this.logger.console; }
    /**
     * Registered events to store off-callbacks
     */
    protected events: Function[];
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
    /**
     * Init bundle
     * @param bundle
     */
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
    /**
     * Register the event
     * @param eventName EventName
     * @param fn Function
     */
    registerEvent(eventName: string, fn: () => void): void {
        const offFn = this.$scope.$on(eventName, fn);
        this.events.push(offFn);
    }
    /**
     * off the bindgins
     */
    registerEvents(): void {
        this.events = [];
        this.registerEvent("$destroy", () => {
            this.events.forEach(fn => {
                fn();
                this.events = [];
            });
        });
    }
    //#endregion

}
//#endregion

export {BaseController}

