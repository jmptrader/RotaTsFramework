import {BaseController} from "./basecontroller"
import {IModelControllerScope, IBaseModel, IBaseModelController, IBundle, IPagingListModel} from "./interfaces"


abstract class BaseModelController<TModel extends IBaseModel> extends BaseController implements IBaseModelController<TModel> {
    $scope: IModelControllerScope<TModel>;

    get model(): TModel | Array<TModel> | IPagingListModel<TModel> { return this.$scope.model; }
    set model(value: TModel | Array<TModel> | IPagingListModel<TModel>) { this.$scope.model = value; }

    constructor(bundle: IBundle) {
        super(bundle);
    }
   
    //#endregion
    abstract getModel(...args: any[]): ng.IPromise<TModel> | TModel | ng.IPromise<Array<TModel>> |
        Array<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;

    protected updateModel(model: TModel | Array<TModel> | IPagingListModel<TModel>): ng.IPromise<TModel | Array<TModel> | IPagingListModel<TModel>> {
        const updatedModel = this.setModel(model);
        return this.common.makePromise(updatedModel).then((data: TModel | Array<TModel>) => {
            if (data) {
                this.model = data;
                //fire model loaded event
                this.loadedModel(data);
            }
            return data;
        });
    }

    protected setModel(model: TModel | Array<TModel> | IPagingListModel<TModel>): TModel | Array<TModel> | IPagingListModel<TModel> {
        return model;
    }

    protected loadedModel(model: TModel | Array<TModel> | IPagingListModel<TModel>): void {
    }

    protected initModel(...args: any[]): void {
        const model = this.getModel(args);
        this.common.makePromise(model).then((data: TModel | Array<TModel> | IPagingListModel<TModel>) => {
            return this.updateModel(data);
        });
    }
}
//Export
export {BaseModelController, }