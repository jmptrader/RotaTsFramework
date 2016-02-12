import {ICacheable} from '../services/caching.interface';

interface IBundle {
    [s: string]: any;
}
interface IBaseController {

}

interface IBaseModel {
    id: number;
}

interface ICacheableModel extends IBaseModel, ICacheable {

}

interface IBaseModelFilter {

}

interface IBaseListModelFilter extends IBaseModelFilter, IPager {

}

interface IBaseCrudModel extends IBaseModel {
}


interface IPagingListModel<TModel extends IBaseModel> {
    data: Array<TModel>;
    total?: number;
}

//interface IModelControllerScope<TModel extends IBaseModel> extends ng.IScope {
//    model: TModel | Array<TModel> | IPagingListModel<TModel>
//}

//interface IListControllerScope<TModel extends IBaseModel> extends IModelControllerScope<TModel> {
//    gridApi: uiGrid.IGridApi;
//    filter: any;
//}

type IModel<TModel extends IBaseModel> = TModel | Array<TModel> | IPagingListModel<TModel>;
type IModelPromise<TModel extends IBaseModel> = ng.IPromise<TModel | Array<TModel> | IPagingListModel<TModel>>;

interface IBaseModelController<TModel extends IBaseModel> extends IBaseController {
    model: IModel<TModel>;
    getModel(modelFilter: IBaseModelFilter): ng.IPromise<TModel> | TModel | ng.IPromise<Array<TModel>> | Array<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
}

interface IBaseListController<TModel extends IBaseModel, TModelFilter extends IBaseListModelFilter> extends IBaseModelController<TModel> {
    getModel(modelFilter?: TModelFilter): ng.IPromise<Array<TModel>> | Array<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
}

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
IListPageOptions, IModelStateParams, IBaseCrudController, IBaseListModelFilter, IBaseModelFilter}