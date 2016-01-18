import {IBaseModelController, BaseModelController, IBundle} from "./basemodelcontroller"
import {IBaseCrudModel} from "./basemodels"

interface IModelStateParams extends ng.ui.IStateParamsService {
    id: number;
}

interface IBaseCrudController<TModel extends IBaseCrudModel> extends IBaseModelController<TModel> {
    $stateParams: IModelStateParams;
    save(model: TModel): ng.IPromise<TModel>;
    deleteById(id: number): ng.IPromise<any>;
    getModel(): ng.IPromise<TModel>;
}

abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> implements IBaseCrudController<TModel> {
    $stateParams: IModelStateParams;
    abstract save(model: TModel): ng.IPromise<TModel>;
    abstract deleteById(id: number): ng.IPromise<any>;
    abstract getModel(): ng.IPromise<TModel>;
}
//Export
export {IBaseCrudController, BaseCrudController, IBundle}