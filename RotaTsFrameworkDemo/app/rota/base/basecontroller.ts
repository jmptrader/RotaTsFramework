//#region Imports
import {ILogger, IBaseLogger} from "../services/logger.interface";
import {ICommon, IChainableMethod} from "../services/common.interface";
import {IRotaRootScope} from "../services/common.interface";
import {IDialogs} from '../services/dialogs.interface';
import {IBundle, IValidationItem, IValidationResult} from './interfaces';
import {IMainConfig} from '../config/config.interface';
import {IRouting} from '../services/routing.interface';
import {ILocalization} from '../services/localization.interface';
//deps
import * as _ from 'underscore';
//#endregion

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
    protected validators: IValidationItem[];
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
        this.validators = [];
        this.events = [];
        this.registerEvent("$destroy", () => {
            this.events.forEach(fn => {
                fn();
            });
            this.events = null;
            this.validators = null;
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
    //#endregion

    //#region Utility Functions
    isAssigned(value: any): boolean {
        return this.common.isAssigned(value);
    }
    //#endregion

    //#region Validations
    /**
     * Add new validation
     * @param item Validation Item
     * @description Adding order will be used if not order prop defined,
     * name prop is handy for dynamic validation enable/disable etc
     */
    addValidation(item: IValidationItem): void {
        if (!item.func)
            throw new Error('func should not be null');

        if (!item.order) {
            item.order = this.validators.length + 1;
        }

        if (!item.enabled) {
            item.enabled = true;
        }
        this.validators.push(item);
    }
    /**
     * Get validation object by name
     * @param name Validation name
     */
    getValidation(name: string): IValidationItem {
        return _.findWhere(this.validators, { name: name });
    }
    /**
     * Remove validation by name
     * @param name Validation name
     */
    removeValidation(name: string): void {
        const validator = _.findWhere(this.validators, { name: name });
        const validatorIndex = this.validators.indexOf(validator);

        if (validatorIndex > -1) {
            this.validators.slice(validatorIndex, 1);
        }
    }
    /**
     * This method is called internally as validation pipline in process
     * @returns it will return failed validation result if any
     * @description Validators is sorted and filtered by enabled prop
     */
    protected applyValidations(validators?: IValidationItem[]): ng.IPromise<any> {
        //filter
        const validatorsToApply = validators || this.validators;
        const filteredValidators = _.where(validatorsToApply, { enabled: true });
        const sortedValidators = _.sortBy(filteredValidators, 'order');
        //run 
        return this.runChainableValidations(sortedValidators);
    }
    /**
     * This method is called internally to get run all validators
     * @param validators Registered validators
     */
    private runChainableValidations(validators: IValidationItem[]): ng.IPromise<any> {
        let result = this.common.promise();
        //iterate chainable methods
        for (let i = 0; i < validators.length; i++) {
            result = ((promise: ng.IPromise<any>, validator: IValidationItem) => {
                return promise.then(() => {
                    return validator.func.call(this, validator);
                });
            })(result, validators[i]);
        }
        return result;
    }
    //#endregion
}

export {BaseController}

