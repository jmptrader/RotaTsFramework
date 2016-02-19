import {IBaseCrudModel, ModelStates, IBaseModel} from "../base/interfaces"
import { IBaseService} from "./service.interface";
interface IRotaRootScope extends ng.IRootScopeService {
    appTitle: string;
    forms: any;
    isCollapsed: boolean;
}

interface ICommon extends IBaseService {
    promise<T>(p?: any): ng.IPromise<T>;
    rejectedPromise(reason?: any): ng.IPromise<any>;
    makePromise<T>(value: any): ng.IPromise<T>;
    isPromise(value: any): value is ng.IPromise<any>;
    isHtml(value: string): boolean;
    extractFileName(path: string): string;
    addSlash(path: string): string;
    addTrailingSlash(path: string): string;
    addPrefixSlash(path: string): string;
    isModel(model: any): model is IBaseModel;
    isCrudModel(model: any): model is IBaseCrudModel;
    setModelState(model: IBaseCrudModel, state: ModelStates, includeChildArray?: boolean): IBaseCrudModel;
}

export {ICommon, IRotaRootScope}