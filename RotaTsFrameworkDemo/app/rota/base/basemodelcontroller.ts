import {IBaseController, BaseController, IBundle} from "./basecontroller"
import {IScopeModel, IBaseModel, IBaseListModel} from "./basemodels"

interface IBaseModelController<TModel extends IBaseModel> extends IBaseController {
    model: TModel | IBaseListModel<TModel>;
    getModel(): ng.IPromise<TModel> | TModel | ng.IPromise<IBaseListModel<TModel> | IBaseListModel<TModel>>;
}

abstract class BaseModelController<TModel extends IBaseModel> extends BaseController implements IBaseModelController<TModel> {
    $scope: IScopeModel<TModel>;

    private _model: TModel | IBaseListModel<TModel>;
    get model(): TModel | IBaseListModel<TModel> { return this._model; }
    set model(value: TModel | IBaseListModel<TModel>) { this._model = value; }

    constructor(bundle: IBundle) {
        super(bundle);
        this.initModel();
    }
   
    //#endregion
    abstract getModel(): ng.IPromise<TModel> | TModel | ng.IPromise<IBaseListModel<TModel> | IBaseListModel<TModel>>;

    private initModel(): void {
        const model = this.getModel();
        this.common.makePromise(model).then((data: TModel | IBaseListModel<TModel>) => {
            return this.model = data;
        });
    }
}
//Export
export {IBaseModelController, BaseModelController, IBundle}