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

//type ISingleModelType<T extends IBaseModel> = T;
//type ISingleModelPromiseType<T extends IBaseModel> = ng.IPromise<T>;
//type IArrayModelType<T extends IBaseModel> = IListModel<T> | IPagingListModel<T>;
//type IArrayModelPromiseType<T extends IBaseModel> = ng.IPromise<IListModel<T>> | ng.IPromise<IPagingListModel<T>>;
//type ISingleModelTypes<T extends IBaseModel> = ISingleModelType<T> | ISingleModelPromiseType<T>;
//type IArrayModelTypes<T extends IBaseModel> = IArrayModelType<T> | IArrayModelPromiseType<T>;
//type IModelType<T extends IBaseModel> = ISingleModelType<T> | IArrayModelType<T>;
//type IModelTypes<T extends IBaseModel> = ISingleModelTypes<T> | IArrayModelTypes<T>;
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
//interface IBaseController {
//}

//interface IBaseModelController<TModel extends IBaseModel> extends IBaseController {
//    model: IModelType<TModel>;
//    getModel(modelFilter: IBaseModelFilter): IModelTypes<TModel>;
//    setModel(model: IModelType<TModel>): IModelType<TModel>;
//}

//interface IBaseListController<TModel extends IBaseModel, TModelFilter extends IBaseListModelFilter> extends IBaseModelController<TModel> {
//    getModel(modelFilter?: TModelFilter): IArrayModelTypes<TModel>;
//    setModel(model: IArrayModelType<TModel>): IArrayModelType<TModel>;
//}
//#endregion

interface IModelStateParams extends ng.ui.IStateParamsService {
    id: number;
}

//interface IBaseCrudController<TModel extends IBaseCrudModel> extends IBaseModelController<TModel> {
//    $stateParams: IModelStateParams;
//    save(model: TModel): ng.IPromise<TModel>;
//    deleteById(id: number): ng.IPromise<any>;
//    getModel(): ISingleModelTypes<TModel>;
//}

export {IBundle, IBaseModel, IBaseCrudModel,ICacheableModel,
IBaseConfig, IBaseConfigProvider, IBaseApi, IPager, IPagingListModel,
IListPageOptions, IModelStateParams, IBaseListModelFilter, IBaseModelFilter,
IGridOptions, IListModel}