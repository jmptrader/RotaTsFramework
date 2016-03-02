//#region Imports
import {IBaseModel, IBundle, IBaseModelFilter} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';
//#endregion

/**
 * Base modal page 
 */
class BaseModalController<TModel extends IBaseModel, TResult extends {}> extends BaseModelController<TModel> {
    /**
    * Model object
    * @returns {TModel}
    */
    get model(): TModel { return <TModel>this._model; }
    set model(value: TModel) { this._model = value; }

    //#region Bundle Services
    static injects = BaseModelController.injects.concat(['$uibModalInstance', 'modalParams']);
    protected $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance;
    private modalParams: TModel;
    /**
    * Update bundle
    * @param bundle IBundle
    */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);
        this.$uibModalInstance = bundle.systemBundles["$uibmodalinstance"];
        this.modalParams = bundle.systemBundles["modalparams"];
    }
    //#endregion

    constructor(bundle: IBundle) {
        super(bundle);
        this.initModel();
    }

    //#region Modal 
    modalResult(data: TResult): void {
        this.$uibModalInstance.close(data);
    }

    closeModal(): void {
        this.$uibModalInstance.dismiss();
    }
    //#endregion

    getModel(): ng.IPromise<TModel> {
        return this.common.makePromise<TModel>(this.modalParams);
    }
}

export {BaseModalController}