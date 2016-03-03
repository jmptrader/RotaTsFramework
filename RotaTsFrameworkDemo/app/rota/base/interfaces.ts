//#region Imports
import {ICacheable} from '../services/caching.interface';
import {LogType} from '../services/logger.interface';
import {IServerFailedResponse, IChainableMethod} from '../services/common.interface';

//#endregion

//#region Main Base Classes
/**
 * Base config for configuration objects
 */
interface IBaseConfig {
}
/**
 * Base config provider for all config providers
 */
interface IBaseConfigProvider<TConfig extends IBaseConfig> {
    config: TConfig;
    configure(config: TConfig): void;
}
/**
 * Base api for all services requests restful server side
 */
interface IBaseApi {
    /**
     * Make get request
     * @param url Url
     * @param params Optional params
     * @returns {IPromise<T>} Promise
     */
    get<T>(url: string, params?: any): angular.IPromise<T>;
    /**
    * Make post request
    * @param url Url
    * @param params Optional params
    * @returns {IPromise<T>} Promise
    */
    post<T>(url: string, params?: any): angular.IPromise<T>;
}
//#endregion

//#region Base Models
//TODO: ICacheableModel silinebilir.
/**
 * Cachable 
 */
interface ICacheableModel extends IBaseModel, ICacheable {

}
/**
 * Base model for all filtering classes
 */
interface IBaseModelFilter {
}
/**
 * Base model 
 */
interface IBaseModel {
}
/**
 * Model states equivalent to Entity framework entity state
 */
export enum ModelStates {
    Detached = 1,
    Unchanged = 2,
    Added = 4,
    Deleted = 8,
    Modified = 16
}
/**
 * Base crud model
 */
interface IBaseCrudModel extends IBaseModel {
    /**
     * Model id
     */
    id: number;
    /**
     * Model state
     * @description Shoul be used along with entityframework entity state
     */
    modelState?: ModelStates;
}
/**
 * Base model for all listing page
 */
interface IBaseListModel<TModel extends IBaseModel> extends Array<TModel> {
}
/**
 * Base paing model for all listing pages
 */
interface IPagingListModel<TModel extends IBaseModel> {
    /**
     * Grid current page data
     */
    data: Array<TModel>;
    /**
     * Total record count
     */
    total?: number;
}
//#endregion

//#region BaseListController 
/**
 * Base filter for all list pages
 */
interface IBaseListModelFilter extends IBaseModelFilter, IPager {
}
/**
 * Grid options include button options
 */
interface IGridOptions extends uiGrid.IGridOptionsOf<any> {
    /**
     * Flag that show edit button on grid 
     */
    showEditButton?: boolean;
    /**
     * Flag that show delete button on grid
     */
    showDeleteButton?: boolean;
}
/**
 * Page options
 */
interface IPager {
    /**
     * Current page number
     */
    currentPage?: number;
    /**
     * Page size,for default,look at config.defaultGridPageSize prop
     */
    pageSize?: number;
}
/**
 * List page options
 */
interface IListPageOptions {
    /**
     * Detail page state name of listing page
     */
    editState: string;
    /**
     * Flag that indicates that if grid is populated at initializing
     */
    initialLoad?: boolean;
    /**
     * Grid paging is enabled or not
     */
    pagingEnabled?: boolean;
    /**
     * New item field name ,default 'new'
     */
    newItemFieldName?: string;
}
/**
 * List page localization  
 */
interface IListPageLocalization {
    kayitbulunamadi: string;
    deleteconfirm: string;
    deleteconfirmtitle: string;
    deleteselected: string;
}
//#endregion

//#region BaseCrudController
/**
 * base model filtering object for crud pages
 */
interface IBaseCrudModelFilter extends IBaseModelFilter {
    /**
     * Model id
     */
    id: number;
}
/**
 * General State params for crud pages
 */
interface ICrudPageStateParams extends ng.ui.IStateParamsService {
    /**
     * Model id ,'new' for new model,and number for edit model
     */
    id: number | string;
    /**
     * For navigation capability,this prop containes all id params of current list dispatched from list page
     */
    navItems: Array<number>;
}
/**
 * Flags for Crud pages
 */
interface ICrudPageFlags {
    /**
     * Saving flag
     */
    isSaving: boolean,
    /**
     * Deleting flag
     */
    isDeleting: boolean,
    /**
     * Copying flag
     */
    isCloning: boolean;
    /**
     * Show that model is in new mode
     */
    isNew: boolean;
}
/**
 * Crud page options given through constructor
 */
interface ICrudPageOptions {
    /**
     * New item field name ,default 'new'
     */
    newItemFieldName?: string;
    /**
     * Insert,Update,Delete process pipelines
     */
    parsers?: ICrudParsers;
}
/**
 * Navigation direction for navigation buttons on crudButtons
 */
export enum NavigationDirection {
    Prev,
    Next
}
/**
 * Localized values for crud page
 */
interface ICrudPageLocalization {
    crudonay: string;
    modelbulunamadi: string;
    kayitkopyalandi: string;
    succesfullyprocessed: string;
    validationhatasi: string;
    bilinmeyenhata: string;
    silmeonay: string;
    silmeonaybaslik: string;
}
/**
 * Save options
 */
interface ISaveOptions {
    /**
     * Show the model is in new mode
     */
    isNew?: boolean;
    /**
     * Flag that continues to new model after saving
     */
    goon?: boolean;
    /**
     * Show message after saving
     */
    showMessage?: boolean;
    /**
     * User Model
     */
    model?: IBaseCrudModel;
}
/**
 * Delete Options
 */
interface IDeleteOptions {
    /**
     * Show message after saving
     */
    showMessage?: boolean;
    /**
    * User Model
    */
    model?: IBaseCrudModel;
    /**
     * Model id
     */
    key: number;
    /**
     * Show confirm dialog
     */
    confirm?: boolean;
}
/**
 * Crud Parsers
 */
interface ICrudParsers {
    /**
     * Parses used for saving process
     */
    saveParsers: Array<IChainableMethod<any>>;
    /**
     * Parses used for deleting process
     */
    deleteParsers: Array<IChainableMethod<any>>;
}
/**
 * Crud types,Flagable
 */
export enum CrudType {
    Create = 1,
    Update = 2,
    Delete = 4
}
//#endregion

//#region Common
/**
 * Bundle for all pages including all built-it and custom dependencies
 */
interface IBundle {
    /**
     * System angular services and thirdparty services 
     */
    systemBundles: { [s: string]: any };
    /**
     * User defined services
     */
    customBundles: { [s: string]: any };
}
/**
 * Parsers exception include notifictaion type and title
 */
interface IParserException extends IServerFailedResponse {
    /**
     * Log title
     */
    title?: string;
    /**
     * Log type
     */
    logType?: LogType;
}

/**
 * Validation result
 */
interface IValidationResult {
    /**
     * Validation message
     */
    message?: string;
    /**
     * Validation i18n key
     */
    messageI18N?: string;
}
/**
 * Validation item
 */
interface IValidationItem {
    /**
     * Validation method which returns promise of any
     */
    func: IChainableMethod<any>;
    /**
     * Optional validation name which is handy for enable/disable/remove operations
     */
    name?: string;
    /**
     * Enable validation flag
     */
    enabled?: boolean;
    /**
     * Order value , in which validaions sorted 
     */
    order?: number;
    /**
     * Crud flags indicates that which crud types validation will be applied
     */
    crudFlag?: CrudType;
}
//#endregion

export {IBundle, IBaseModel, IBaseCrudModel, ICacheableModel,
IBaseConfig, IBaseConfigProvider, IBaseApi, IPager, IPagingListModel,
IListPageOptions, ICrudPageStateParams, IBaseListModelFilter, IBaseModelFilter,
IGridOptions, IBaseListModel, ICrudPageOptions, ICrudPageFlags,
IBaseCrudModelFilter, ICrudPageLocalization, ISaveOptions, IValidationItem, IValidationResult,
IListPageLocalization, ICrudParsers, IParserException, IDeleteOptions}