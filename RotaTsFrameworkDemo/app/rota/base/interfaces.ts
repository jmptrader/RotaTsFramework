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

interface IBaseModel {
    id: number;
}

interface ICacheableModel extends IBaseModel, ICacheable {

}

interface IBaseModelFilter {

}

interface IBaseCrudModel extends IBaseModel {
}


interface IPagingListModel<TModel extends IBaseModel> {
    data: Array<TModel>;
    total?: number;
}
//#endregion

//#region ListController Stuffs
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

//#region Base Controllers
interface IBaseController {
}

interface IBaseModelController<TModel extends IBaseModel> extends IBaseController {
    model: TModel | Array<TModel> | IPagingListModel<TModel>;
    getModel(modelFilter: IBaseModelFilter): ng.IPromise<TModel> | TModel | ng.IPromise<Array<TModel>> | Array<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
}

interface IBaseListController<TModel extends IBaseModel, TModelFilter extends IBaseListModelFilter> extends IBaseModelController<TModel> {
    getModel(modelFilter?: TModelFilter): ng.IPromise<Array<TModel>> | Array<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
}

//#endregion




interface IModelStateParams extends ng.ui.IStateParamsService {
    id: number;
}

interface IBaseCrudController<TModel extends IBaseCrudModel> extends IBaseModelController<TModel> {
    $stateParams: IModelStateParams;
    save(model: TModel): ng.IPromise<TModel>;
    deleteById(id: number): ng.IPromise<any>;
    getModel(): ng.IPromise<TModel>;
}

export {IBundle, IBaseController, IBaseModel, IBaseCrudModel,
IBaseModelController, ICacheableModel, IBaseListController,
IBaseConfig, IBaseConfigProvider, IBaseApi, IPager, IPagingListModel,
IListPageOptions, IModelStateParams, IBaseCrudController, IBaseListModelFilter, IBaseModelFilter, IGridOptions}