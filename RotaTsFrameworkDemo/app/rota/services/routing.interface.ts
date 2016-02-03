//#region Imports
import { IBaseConfig} from "../base/baseconfig";
import { IBaseModel} from "../base/basemodels";
import { IBaseService} from "./service.interface";
//#endregion


interface IRouteConfig extends IBaseConfig {
    /**
     * BasePath should come form requireJs baseUrl
     */
    basePath?: string;
    baseUrl?: string;
    shellPath?: string;
    error404StateUrl?: string;
    error500StateUrl?: string;
    inactiveStateUrl?: string;
    startUpState?: string;
}

interface IRouting extends IBaseService {
    //props
    states: IMenuModel[];
    menus: IHierarchicalMenuItem[];
    breadcrumbs: IBreadcrumb[];
    activeMenu: IHierarchicalMenuItem;
    //methods
    addMenus(states: IMenuModel[]): IRouting;
    go(state: string, params?: any, options?: ng.ui.IStateOptions): ng.IPromise<any>;
    reload(): ng.IPromise<any>;
    start(stateName: string, params?: any): void;
}

interface IMenuItem {
    title?: string;
    titleI18N?: string;
    order?: number,
    menuIcon?: string;
    isLink?: boolean;
    startGroup?: boolean;
    parentId?: number,
    showMenu?: boolean;
    state?: string;
}

interface IHierarchicalMenuItem extends IMenuItem {
    parentMenu?: IHierarchicalMenuItem;
    subMenus?: IHierarchicalMenuItem[];
}

interface IRotaState extends ng.ui.IState {
    hierarchicalMenu?: IHierarchicalMenuItem;
    controllerUrl?: string;
}

interface IMenuModel extends IRotaState, IMenuItem, IBaseModel {
}

interface IBreadcrumb {
    text: string;
    state: string;
}

export {IRouteConfig, IRouting, IRotaState, IMenuItem, IMenuModel,
IHierarchicalMenuItem, IBreadcrumb};