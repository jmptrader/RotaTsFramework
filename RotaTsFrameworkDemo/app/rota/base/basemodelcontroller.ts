//#region Imports
import {IBaseModel, IBundle, IPagingListModel, IBaseModelFilter,
    IBaseListModel, IParserException} from "./interfaces"
import {LogType} from '../services/logger.interface';
import {IException, IChainableMethod} from '../services/common.interface';
//deps
import {BaseController} from "./basecontroller"
//#endregion

//#region BaseModelController
abstract class BaseModelController<TModel extends IBaseModel> extends BaseController {
    //#region Props
    protected _model: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>;
    /**
     * Model object
     * @returns {IModelType<TModel>}
     */
    get model(): TModel | IBaseListModel<TModel> | IPagingListModel<TModel> { return this._model; }
    set model(value: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>) { this._model = value; }
    //#endregion

    //#region Bundle Services
    protected $q: ng.IQService;
    protected $http: ng.IHttpService;
    static injects = BaseController.injects.concat(['$q', '$http']);
    //#endregion

    //#region Init
    constructor(bundle: IBundle) {
        super(bundle);
    }
    /**
    * Update bundle
    * @param bundle IBundle
    */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);

        this.$q = bundle.systemBundles['$q'];
        this.$http = bundle.systemBundles['$http'];
    }
    //#endregion

    //#region BaseModelController Methods
    /**
     * @abstract Abstract get model method
     * @param args Optional params
     */
    abstract getModel(modelFilter?: IBaseModelFilter): ng.IPromise<TModel> | TModel | ng.IPromise<IBaseListModel<TModel>> |
        IBaseListModel<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Update model after fetching data
     * @param model Model
     */
    updateModel(model: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>): ng.IPromise<TModel | IBaseListModel<TModel> | IPagingListModel<TModel>> {
        const updatedModel = this.setModel(model);
        return this.common.makePromise(updatedModel).then((data: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>) => {
            if (data) {
                this.model = data;
            }
            return data;
        });
    }
    /**
     * Fired if there is an error while model processing
     * @param reason Error reason
     */
    protected errorModel(exception: IParserException): void {
        const exceptionMessages = new Array<string>();
        if (exception.errorMessages && exception.errorMessages.length) {
            exceptionMessages.concat(exception.errorMessages);
        }
        exception.exceptionMessage && exceptionMessages.push(exception.exceptionMessage);

        if (!exceptionMessages.length) return;

        const message = exceptionMessages.join('<br/>');
        switch (exception.logType) {
            case LogType.Error:
                this.notification.error({ title: exception.title, message: message });
                break;
            case LogType.Warn:
                this.notification.warn({ title: exception.title, message: message });
                break;
            default:
                this.notification.error({ title: exception.title, message: message });
                break;
        }
    }
    /**
     * Set model for some optional modifications
     * @param model Model
     */
    protected setModel(model: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>): TModel | IBaseListModel<TModel> | IPagingListModel<TModel> {
        return model;
    }
    /**
     * Loaded model method triggered at last
     * @param model
     */
    protected loadedModel(model: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>): void {
    }


    defineModel(modelFilter?: IBaseModelFilter): ng.IPromise<TModel> | TModel | ng.IPromise<IBaseListModel<TModel>> |
        IBaseListModel<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel> {
        return this.getModel(modelFilter);
    }
    /**
     * Initiates getting data
     * @param args Optional params
     */
    protected initModel(modelFilter?: IBaseModelFilter): ng.IPromise<TModel | IBaseListModel<TModel> | IPagingListModel<TModel>> {
        const defineModelResult = this.defineModel(modelFilter);
        return this.common.makePromise(defineModelResult).then((data: TModel | IBaseListModel<TModel> | IPagingListModel<TModel>) => {
            return this.updateModel(data).then(() => {
                this.loadedModel(data);
                return data;
            });
        }, (reason: any) => {
            //TODO: can be changed depending on server excepion response
            this.errorModel(reason.data || reason);
        });
    }
    /**
     * Process chainable thenable functions
     * @param pipeline Thenable functions
     * @param params Optional parameters
     */
    protected initParsers<T>(pipeline: Array<IChainableMethod<T>>, ...params: any[]): ng.IPromise<T> {
        let result = this.common.promise();
        //iterate pipeline methods
        for (let i = 0; i < pipeline.length; i++) {
            result = ((promise: ng.IPromise<any>, method: IChainableMethod<T>) => {
                return promise.then((response: any) => {
                    response && params.push(response);
                    if (method) {
                        return method.apply(this, params);
                    }
                    return params;
                });
            })(result, pipeline[i]);
        }
        result.catch<IParserException>((reason: IParserException) => {
            this.errorModel(reason);
            return this.common.rejectedPromise(reason);
        });
        return result;
    }
    //#endregion
}

//#endregion

export {BaseModelController }