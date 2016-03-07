//#region Imports
import { IBaseModel, IBaseConfig} from "../base/interfaces";
import { IBaseService} from "./service.interface";
//#endregion

//#region Menu & State Base Objects
/**
 * Menu Item
 */
interface IMenuItem {
    /**
     * Menu title
     */
    title?: string;
    /**
     * Menu title localization title
     */
    titleI18N?: string;
    /**
     * Menu order 
     */
    order?: number,
    /**
     * Menu fontawesome icon
     * @description go to http://fortawesome.github.io/Font-Awesome/icons/ for icons library
     */
    menuIcon?: string;
    /**
     * Flag that menu will be link that direct the page 
     */
    isLink?: boolean;
    /**
     * Starts a new group
     */
    startGroup?: boolean;
    /**
     * Parent id value for nesting
     */
    parentId?: number,
    /**
     * Flag that state menu will be visible on menu list
     */
    showMenu?: boolean;
    /**
     * State unique name
     * @description it must be omitted if only menu is used
     */
    state?: string;
}
/**
 * Hierarchical menu item that including subMenus and parent menu
 */
interface IHierarchicalMenuItem extends IMenuItem {
    /**
     * Parent item
     */
    parentMenu?: IHierarchicalMenuItem;
    /**
     * Sub menus
     */
    subMenus?: IHierarchicalMenuItem[];
}
/**
 * State that links states with menus
 */
interface IRotaState extends ng.ui.IState {
    /**
     * Linked menu
     */
    hierarchicalMenu?: IHierarchicalMenuItem;
    /**
     * State controller url
     */
    controllerUrl?: string;
}
/**
 * Base menu viewmodel object 
 */
interface IMenuModel extends IRotaState, IMenuItem, IBaseModel {
    id: number;
}
/**
 * Breadcrumb object
 */
interface IBreadcrumb {
    text: string;
    state: string;
}

//#endregion

//#region Routing config
/**
 * Route config
 */
interface IRouteConfig extends IBaseConfig {
    /**
     * BasePath should come form requireJs baseUrl
     */
    basePath?: string;
    /**
     * Base url of address default "/"
     */
    baseUrl?: string;
    /**
     * Base shell path
     */
    shellPath?: string;
    /**
     * Error 404 not found state url
     */
    error404StateUrl?: string;
    /**
     * Error 500 internal error state url
     */
    error500StateUrl?: string;
    /**
     * if there is no such state demanded,it will be transitioned to inactiveStateUrl
     */
    inactiveStateUrl?: string;
    /**
     * State name that will be the first when app initiliazed
     */
    startUpState?: string;
    /**
    * Content controller alias name 
    */
    contentControllerAlias?: string;
    /**
     * Modal controller alias name 
     */
    shellControllerAlias?: string;
}

//#endregion

//#region Routing service
/**
 * Routing service
 */
interface IRouting extends IBaseService {
    /**
     * All registered states
     */
    states: IMenuModel[];
    /**
     * All menus registered
     */
    menus: IHierarchicalMenuItem[];
    /**
     * Breadcrumbs
     */
    breadcrumbs: IBreadcrumb[];
    /**
     * Current selected menu
     */
    activeMenu: IHierarchicalMenuItem;
    /**
     * Current state
     */
    current: IRotaState;
    /**
     * Add menus
     * @param states Menu states
     * @returns {IRouting} Routing service
     */
    addMenus(states: IMenuModel[]): IRouting;
    /**
     * Go to state
     * @param state  State to go
     * @param params State parameters
     * @param options Optional settings of state
     * @returns {ng.IPromise<any>} Promise of any
     */
    go(state: string, params?: any, options?: ng.ui.IStateOptions): ng.IPromise<any>;
    /**
     * Reload content page
     * @returns {ng.IPromise<any>} Promise
     */
    reload(): ng.IPromise<any>;
    /**
     * Initial state when application bootstraped
     * @param stateName State name
     * @param params State parameters     
     */
    start(stateName: string, params?: any): void;
}

//#endregion

export {IRouteConfig, IRouting, IRotaState, IMenuItem, IMenuModel, IHierarchicalMenuItem, IBreadcrumb};