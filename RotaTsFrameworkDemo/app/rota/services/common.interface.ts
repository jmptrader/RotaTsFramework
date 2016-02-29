import {IBaseCrudModel, ModelStates, IBaseModel} from "../base/interfaces"
import { IBaseService} from "./service.interface";

interface IRotaRootScope extends ng.IRootScopeService {
    appTitle: string;
    forms: any;
    isCollapsed: boolean;
}

interface IChainableMethod<T> {
    (...args: any[]): ng.IPromise<T>;
}

interface IException {
    exceptionMessage: string;
    exception?: string;
    stackTrace?: string;
    errorMessages?: Array<string>;
}

interface IServerResponse {
    entity?: IBaseCrudModel,
    warningMessages?: Array<string>;
    successMessages?: Array<string>;
    infoMessages?: Array<string>;
}

interface ICommon extends IBaseService {
    promise<T>(p?: any): ng.IPromise<T>;
    rejectedPromise<T>(reason?: T): ng.IPromise<T>;
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
    isAssigned(value: any): boolean;
    isArray<T>(value: any): value is Array<T>;
}

export {ICommon, IRotaRootScope, IChainableMethod, IException, IServerResponse}