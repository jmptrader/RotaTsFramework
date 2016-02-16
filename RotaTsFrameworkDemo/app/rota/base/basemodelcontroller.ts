//#region Imports
import {IBaseModel, IBundle, IPagingListModel, IBaseModelFilter, IListModel} from "./interfaces"
//deps
import {BaseController} from "./basecontroller"
//#endregion

//#region BaseModelController
abstract class BaseModelController<TModel extends IBaseModel> extends BaseController {
    //#region Props
    private _model: TModel | IListModel<TModel> | IPagingListModel<TModel>;
    /**
     * Model object
     * @returns {IModelType<TModel>}
     */
    get model(): TModel | IListModel<TModel> | IPagingListModel<TModel> { return this._model; }
    set model(value: TModel | IListModel<TModel> | IPagingListModel<TModel>) { this._model = value; }
    //#endregion

    constructor(bundle: IBundle) {
        super(bundle);
    }
    /**
     * @abstract Abstract get model method
     * @param args Optional params
     */
    abstract getModel(modelFilter?: IBaseModelFilter): ng.IPromise<TModel> | TModel | ng.IPromise<IListModel<TModel>> |
        IListModel<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Update model after fetching data
     * @param model Model
     */
    protected updateModel(model: TModel | IListModel<TModel> | IPagingListModel<TModel>): ng.IPromise<TModel | IListModel<TModel> | IPagingListModel<TModel>> {
        const updatedModel = this.setModel(model);
        return this.common.makePromise(updatedModel).then((data: TModel | IListModel<TModel> | IPagingListModel<TModel>) => {
            if (data) {
                this.model = data;
                //fire model loaded event
                this.loadedModel(data);
            }
            return data;
        });
    }
    /**
     * Fired if there is an error while model loading
     * @param reason Error reason
     */
    protected errorModel(reason: any): void {
    }
    /**
     * Set model for some optional modifications
     * @param model Model
     */
    protected setModel(model: TModel | IListModel<TModel> | IPagingListModel<TModel>): TModel | IListModel<TModel> | IPagingListModel<TModel> {
        return model;
    }
    /**
     * Loaded model method triggered at last
     * @param model
     */
    protected loadedModel(model: TModel | IListModel<TModel> | IPagingListModel<TModel>): void {
    }
    /**
     * Initiates getting data
     * @param args Optional params
     */
    protected initModel(modelFilter: IBaseModelFilter): ng.IPromise<TModel | IListModel<TModel> | IPagingListModel<TModel>> {
        const model = this.getModel(modelFilter);
        return this.common.makePromise(model).then((data: TModel | IListModel<TModel> | IPagingListModel<TModel>) => {
            return this.updateModel(data);
        }, (reason: any) => {
            this.errorModel(reason);
        });
    }
}

//#endregion

export {BaseModelController }