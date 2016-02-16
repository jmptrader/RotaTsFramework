import {IBaseCrudModel, IBundle, IModelStateParams} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';


abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {
    $stateParams: IModelStateParams;
    abstract save(model: TModel): ng.IPromise<TModel>;
    abstract deleteById(id: number): ng.IPromise<any>;
    abstract getModel(): ng.IPromise<TModel>;
}
//Export
export {BaseCrudController}