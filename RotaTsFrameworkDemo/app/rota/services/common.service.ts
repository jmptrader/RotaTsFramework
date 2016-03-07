//#region Imports
import {IBaseCrudModel, ModelStates, IBaseModel} from "../base/interfaces"
import {ICommon, IChainableMethod} from './common.interface';
import {IRouteConfig} from './routing.config'
import {IMainConfig} from '../config/config.interface';
//#endregion

//#region Common Service

class Common implements ICommon {
    serviceName: string = "Common Service";
    //states
    static $inject = ['$q', 'Config'];
    constructor(private $q: ng.IQService, private config: IMainConfig) { }

    //#region Promise Utils
    /**
     * Return promise with provided arg
     * @param p Arg
     */
    promise<T>(p?: any): ng.IPromise<T> {
        return this.$q.when<T>(p);
    }
    /**
     * Return rejected promise with reason
     * @param reason Arg
     */
    rejectedPromise<T>(reason?: T): ng.IPromise<T> {
        const d = this.$q.defer<T>();
        d.reject(reason);
        return d.promise;
    }
    /**
     * Return promise with provided arg if its not thenable
     * @param value Arg
     */
    makePromise<T>(value: any): ng.IPromise<T> {
        return this.isPromise(value) ? value : this.promise<T>(value);
    }
    /**
     * Check whether or not provided param is promise
     * @param value Arg
     */
    isPromise(value: any): value is ng.IPromise<any> {
        return value && angular.isFunction(value.then);
    }
    //#endregion

    //#region Path Utils
    /**
     * Check whether or not provided value ends with html extension
     * @param value Arg
     */
    isHtml(value: string): boolean {
        return value.indexOf('html', value.length - 4) > -1;
    }
    /**
     * Extract file name from full path
     * @param path File full path
     */
    extractFileName(path: string): string {
        var fname = path.split('/').pop();
        var dotIndex = fname.indexOf('.');

        if (dotIndex > -1)
            return fname.substr(0, dotIndex);
        else
            return fname;
    }
    /**
     * Add prefix/suffix slash's
     * @param path Path
     */
    addSlash(path: string): string {
        return this.addPrefixSlash(this.addTrailingSlash(path));
    }
    /**
     * Add trailing slash
     * @param path Path
     */
    addTrailingSlash(path: string): string {
        var sonChar = path && path[path.length - 1];

        if (sonChar === '/')
            return path;
        else
            return path + '/';
    }
    /**
     * Add prefix slash
     * @param path Path
     */
    addPrefixSlash(path: string): string {
        var ilkChar = path && path[0];

        if (ilkChar === '/')
            return path;
        else
            return '/' + path;
    }
    //#endregion

    //#region Utils
    /**
     * Return true if value nor null and undefined
     * @param value Any object
     */
    isAssigned(value: any): boolean {
        return value !== undefined && value !== null;
    }
    /**
     * Guard method checks for array objects
     * @param value Any object
     */
    isArray<T>(value: any): value is Array<T> {
        return angular.isArray(value);
    }
    /**
     * Guard method checks for function
     * @param value
     */
    isFunction(value: any): value is Function {
        return angular.isFunction(value);
    }
    /**
     * Guard method checks for defined
     * @param value
     */
    isDefined<T>(value: any): value is T {
        return angular.isDefined(value);
    }
    /**
     * Convert html to plain text
     * @param html Html  
     */
    htmlToPlaintext(html: string): string {
        if (!html) return '';
        return html.replace(/<[^>]+>/gm, '');
    }
    //#endregion

    //#region Model Utils
    /**
     * Check whether model is valid crudModel
     * @param model
     */
    isCrudModel(model: any): model is IBaseCrudModel {
        return model.modelState !== undefined && model.modelState !== null;
    }
    /**
     * Set model state according to form crud state
     * @param model Model object
     * @param state Model State - Entity State
     * @param includeChildArray Flag that iterate all relational entities to modify model state
     */
    setModelState(model: IBaseCrudModel, state: ModelStates, includeChildArray: boolean = true): IBaseCrudModel {
        if (!model || !this.config.setModelStateForEntityFramework) return model;

        if (model.modelState === state ||
            (state === ModelStates.Modified && model.modelState !== ModelStates.Unchanged)) {
            return model;
        }
        model.modelState = state;
        //set child arrays
        if (includeChildArray) {
            for (let prop in model) {
                if (model.hasOwnProperty(prop)) {
                    const p = model[prop];
                    if (angular.isArray(p)) {
                        angular.forEach(p, (item: IBaseCrudModel) => {
                            if (item.modelState !== state) {
                                this.setModelState(item, state, includeChildArray);
                            }
                        });
                    }
                }
            }
        }

        return model;
    }
    //#endregion
}

//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.services.common', [])
    .service('Common', Common);
//#endregion

export {Common}