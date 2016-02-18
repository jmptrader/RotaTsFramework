import {ICacheable} from '../services/caching.interface';

//#region Misc
interface IBundle {
    [s: string]: any;
}

//#endregion


//#region Main Base Classes

interface IBaseConfig {
}

interface IBaseConfigProvider<TConfig extends IBaseConfig> {
    config: TConfig;
    configure(config: TConfig): void;
}

interface IBaseApi {
    get<T>(url: string, params?: any): angular.IPromise<T>;
    post<T>(url: string, params?: any): angular.IPromise<T>;
}
//#endregion

//#region Base Models
interface ICacheableModel extends IBaseModel, ICacheable {

}

interface IBaseModelFilter {
}

interface IBaseModel {
    id: number;
}

interface IBaseCrudModel extends IBaseModel {
}

interface IListModel<TModel extends IBaseModel> extends Array<TModel> {
}

interface IPagingListModel<TModel extends IBaseModel> {
    data: Array<TModel>;
    total?: number;
}
//#endregion

//#region ListController Stuffs
interface IBaseListController {
    listPageOptions: IListPageOptions;
    goToDetailState(id?: string): ng.IPromise<any>;
}

interface IBaseListModelFilter extends IBaseModelFilter, IPager {

}

interface IGridOptions extends uiGrid.IGridOptionsOf<any> {
    showEditButton?: boolean;
    showDeleteButton?: boolean;
}

interface IPager {
    currentPage?: number;
    pageSize?: number;
}

interface IListPageOptions {
    editState: string;
    initialLoad?: boolean;
    pagingEnabled?: boolean;
    newItemFieldName?: string;
}
//#endregion

interface IModelStateParams extends ng.ui.IStateParamsService {
    id: number;
}

export {IBundle, IBaseModel, IBaseCrudModel, ICacheableModel,
IBaseConfig, IBaseConfigProvider, IBaseApi, IPager, IPagingListModel,
IListPageOptions, IModelStateParams, IBaseListModelFilter, IBaseModelFilter,
IGridOptions, IListModel, IBaseListController}