import {IBaseModelController, BaseModelController, IBundle} from "./basemodelcontroller"
import {IBaseListModel, IBaseModel} from "./basemodels"


interface IBaseListController<TModel extends IBaseModel> extends IBaseModelController<TModel> {
    getModel(): ng.IPromise<IBaseListModel<TModel>>;
}

abstract class BaseListController<TModel extends IBaseModel> extends BaseModelController<TModel> implements IBaseListController<TModel> {
    abstract getModel(): ng.IPromise<IBaseListModel<TModel>>;
}

//Export
export {IBaseListController, BaseListController, IBundle}