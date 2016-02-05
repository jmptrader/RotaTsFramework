//#region Imports
import {IModelControllerScope, IBaseModel, IBaseModelController, IBundle, IPagingListModel} from "./interfaces"
//deps
import {BaseController} from "./basecontroller"
//#endregion

//#region BaseModelController

abstract class BaseModelController<TModel extends IBaseModel> extends BaseController implements IBaseModelController<TModel> {
    //#region Props
    $scope: IModelControllerScope<TModel>;

    get model(): TModel | Array<TModel> | IPagingListModel<TModel> { return this.$scope.model; }
    set model(value: TModel | Array<TModel> | IPagingListModel<TModel>) { this.$scope.model = value; }
    //#endregion
    
    constructor(bundle: IBundle) {
        super(bundle);
    }
    /**
     * Abstract get model method
     * @param args Optional params
     */
    abstract getModel(...args: any[]): ng.IPromise<TModel> | TModel | ng.IPromise<Array<TModel>> |
        Array<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Update model after fetching data
     * @param model Model
     */
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
    /**
     * Set model for some optional modifications
     * @param model Model
     */
    protected setModel(model: TModel | Array<TModel> | IPagingListModel<TModel>): TModel | Array<TModel> | IPagingListModel<TModel> {
        return model;
    }
    /**
     * Loaded model method triggered at last
     * @param model
     */
    protected loadedModel(model: TModel | Array<TModel> | IPagingListModel<TModel>): void {
    }
    /**
     * Initiates getting data
     * @param args Optional params
     */
    protected initModel(...args: any[]): void {
        const model = this.getModel(args);
        this.common.makePromise(model).then((data: TModel | Array<TModel> | IPagingListModel<TModel>) => {
            return this.updateModel(data);
        });
    }
}

//#endregion

export {BaseModelController, }