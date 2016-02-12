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
    isPromise(value: any): boolean;
    isHtml(value: string): boolean;
    extractFileName(path: string): string;
    addSlash(path: string): string;
    addTrailingSlash(path: string): string;
    addPrefixSlash(path: string): string;
}

export {ICommon, IRotaRootScope}