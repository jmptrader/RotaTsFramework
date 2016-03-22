//#region Imports
import {IBaseCrudModel, ModelStates, IBaseModel} from "../base/interfaces"
import { IBaseService} from "./service.interface";

//#endregion

//#region Common Interfaces

/**
 * Modified root scope 
 */
interface IRotaRootScope extends ng.IRootScopeService {
    appTitle: string;
    forms: any;
    isCollapsed: boolean;
}
/**
 * Used for chainable promise function
 */
interface IChainableMethod<T> {
    (...args: any[]): ng.IPromise<T>;
}
/**
 * Base server abstract response
 */
interface IBaseServerResponse {
}
/**
 * Common server error response
 */
interface IServerFailedResponse extends IBaseServerResponse {
    /**
     * Exception message when debugging
     */
    exceptionMessage: string;
    /**
     * Stack trace used for debugging
     */
    stackTrace?: string;
    /**
     * Custom error messages 
     */
    errorMessages?: Array<string>;
}
/**
 * Server crud response
 */
interface ICrudServerResponse extends IBaseServerResponse {
    /**
     * Crud Model
     */
    model?: IBaseCrudModel,
    /**
     * User defined warning messages from server
     */
    warningMessages?: Array<string>;
    /**
     * User defined success messages from server
     */
    successMessages?: Array<string>;
    /**
     * User defined info messages from server
     */
    infoMessages?: Array<string>;
}

//#endregion

//#region Common Service
/**
 * Common service 
 */
interface ICommon extends IBaseService {
    /**
    * Return promise with provided arg
    * @param p Arg
    */
    promise<T>(p?: any): ng.IPromise<T>;
    /**
    * Return rejected promise with reason
    * @param reason Arg
    */
    rejectedPromise<T>(reason?: T): ng.IPromise<T>;
    /**
    * Return promise with provided arg if its not thenable
    * @param value Arg
    */
    makePromise<T>(value: any): ng.IPromise<T>;
    /**
    * Check whether or not provided param is promise
    * @param value Arg
    */
    isPromise(value: any): value is ng.IPromise<any>;
    /**
   * Check whether or not provided value ends with html extension
   * @param value Arg
   */
    isHtml(value: string): boolean;
    /**
    * Extract file name from full path
    * @param path File full path
    */
    extractFileName(path: string): string;
    /**
    * Add prefix/suffix slash's
    * @param path Path
    */
    addSlash(path: string): string;
    /**
   * Add trailing slash
   * @param path Path
   */
    addTrailingSlash(path: string): string;
    /**
     * Add prefix slash
     * @param path Path
     */
    addPrefixSlash(path: string): string;
    /**
    * Check whether model is valid crudModel
    * @param model
    */
    isCrudModel(model: any): model is IBaseCrudModel;
    /**
    * Set model state according to form crud state
    * @param model Model object
    * @param state Model State - Entity State
    * @param includeChildArray Flag that iterate all relational entities to modify model state
    */
    setModelState(model: IBaseCrudModel, state: ModelStates, includeChildArray?: boolean): IBaseCrudModel;
    /**
     * Get a new crud model 
     * @param props
     */
    newCrudModel(props?: any): IBaseCrudModel;
    /**
     * Extend T
     * @param source Source of T
     * @param destinations Destinations of T
     */
    extend<TSource>(source: TSource, ...destinations: any[]): TSource;
    /**
    * Merge source with all destinations
    * @param source Source of TSource
    * @param destinations Destinations of any
    */
    merge<TSource>(source: TSource, ...destinations: any[]): TSource;
    /**
     * Checks string value is not empty or null
     * @param value
     */
    isNullOrEmpty(value: string): boolean;
    /**
     * Return true if value nor null and undefined
     * @param value Any object
     */
    isAssigned(value: any): boolean;
    /**
     * Guard method checks for string
     * @param value Any object
     */
    isString(value: any): value is String;
    /**
   * Guard method checks for array objects
   * @param value Any object
   */
    isArray<T>(value: any): value is Array<T>;
    /**
    * Guard method checks for function
    * @param value
    */
    isFunction(value: any): value is Function;
    /**
     * Guard method checks for defined
     * @param value
     */
    isDefined<T>(value: any): value is T;
    /**
    * Convert html to plain text
    * @param html Html  
    */
    htmlToPlaintext(html: string): string;
    /**
    * PreventDefault utility method
    * @param $event Angular event
    */
    preventClick(event: ng.IAngularEvent | Event | JQueryEventObject): void;
    /**
    * Convert object to generic array
    * @param obj Object to convert
    */
    convertObjToArray<T>(obj: any, objValuePropName: string, objDisplayPropName: string): Array<T>;
    /**
    * Convert Enum obj to Array for binding
    * @param value Enum object
    */
    convertEnumToArray(value: any): any[];
}
//#endregion

export {ICommon, IRotaRootScope, IChainableMethod, IServerFailedResponse, ICrudServerResponse, IBaseServerResponse}