import {IBaseModelController, IBaseCrudModel, IBundle, IModelStateParams, IBaseCrudController} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';


abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> implements IBaseCrudController<TModel> {
    $stateParams: IModelStateParams;
    abstract save(model: TModel): ng.IPromise<TModel>;
    abstract deleteById(id: number): ng.IPromise<any>;
    abstract getModel(): ng.IPromise<TModel>;
}
//Export
export {BaseCrudController}