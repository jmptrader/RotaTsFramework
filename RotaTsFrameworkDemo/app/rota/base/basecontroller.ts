//#region Imports
import {ILogger, IBaseLogger} from "../services/logger.interface";
import {ICommon} from "../services/common.interface";
import {IRotaRootScope} from "../services/common.interface";
import {IDialogs} from '../services/dialogs.interface';
import {IBundle} from './interfaces';
import {IMainConfig} from '../config/config.interface';
import {IRouting} from '../services/routing.interface';
import {ILocalization} from '../services/localization.interface';
//deps
import * as _ from 'underscore';
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
    constructor(bundle: IBundle) {
        this.initBundle(bundle);
        //init 
        this.events = [];
        this.registerEvent("$destroy", () => {
            this.events.forEach(fn => {
                fn();
                this.events = [];
            });
        });
        //save localization
        this.storeLocalization();
    }
    /**
     * Store localized value for performance issues
     * @description Must be overriden overrided classes
     */
    protected storeLocalization(): void {
    }
    /**
     * Init bundle
     * @param bundle
     */
    protected initBundle(bundle: IBundle): void {
        //system
        this.$rootScope = bundle.systemBundles['$rootscope'];
        this.$scope = bundle.systemBundles['$scope'];
        this.$window = bundle.systemBundles["$window"];
        this.$stateParams = bundle.systemBundles["$stateparams"];
        //rota
        this.logger = bundle.systemBundles["logger"];
        this.common = bundle.systemBundles["common"];
        this.dialogs = bundle.systemBundles["dialogs"];
        this.config = bundle.systemBundles["config"];
        this.routing = bundle.systemBundles["routing"];
        this.localization = bundle.systemBundles["localization"];
        //custom
        for (let customBundle in bundle.customBundles) {
            ((bundleName: string) => {
                Object.defineProperty(this, bundleName, {
                    get: () => {
                        return bundle.customBundles[bundleName];
                    }
                });
            })(customBundle);
        }
    }

    //#endregion

    //#region BaseController Methods
    /**
     * Register the event
     * @param eventName EventName
     * @param fn Function
     */
    registerEvent(eventName: string, fn: (...args: any[]) => void): void {
        const offFn = this.$scope.$on(eventName, fn);
        this.events.push(offFn);
    }

    //storeLocalization(key: string, object: any): void;
    //storeLocalization(keys: string[], object: any): void;
    //storeLocalization(key: any, object: any): void {
    //    const setValue = (key: string) => {
    //        if (!object.hasOwnProperty(key)) {
    //            object[key] = this.localization.getLocal(key);
    //        }
    //    }

    //    if (this.common.isArray<string>(key)) {
    //        key.forEach((item: string) => {
    //            setValue(item);
    //        });
    //    } else {
    //        setValue(key);
    //    }
    //}
    //#endregion

    //#region Utility Functions
    isAssigned(value: any): boolean {
        return this.common.isAssigned(value);
    }
    //#endregion
}
//#endregion

export {BaseController}

