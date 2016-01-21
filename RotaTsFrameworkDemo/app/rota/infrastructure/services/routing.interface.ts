//#region Imports
import { IBaseConfig} from "../base/baseconfig";
import { IBaseModel} from "../base/basemodels";
import { IBaseService} from "./service.interface";
import IUrlMatcher = angular.ui.IUrlMatcher; 
//#endregion


interface IRouteConfig extends IBaseConfig {
    baseUrl:string;
    shellPath: string;
    error404StateUrl: string;
    error500StateUrl: string;
    inactiveStateUrl: string;
    startUpState: string;
}

interface IRouting extends IBaseService {
    //Methods
    addMenus(states: IRotaState[]): IRouting;
    go(state: string, params?: any, options?: ng.ui.IStateOptions): ng.IPromise<any>;
    getState(stateName: string): IRotaState;
    reload(): ng.IPromise<any>;
    start(stateName: string, params?: any): void;
}

interface IMenuItem extends IBaseModel {
    title?: string;
    titleI18N?: string;
    order?: number,
    menuIcon?: string;
    isLink?: boolean;
    startGroup?: boolean;
    parentId?: number,
    parentMenu?: IMenuItem;
    subMenus?: IMenuItem[];
    //state?: string | IUrlMatcher;
    showMenu?: boolean;
}

interface IRotaState extends ng.ui.IState, IMenuItem {
    controllerUrl?: string;
}

export {IRouteConfig, IRouting, IRotaState, IMenuItem};