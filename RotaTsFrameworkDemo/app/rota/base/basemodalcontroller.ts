//#region Imports
import {IBaseModel, IBundle, IBaseModelFilter, ModelStates} from "./interfaces"
import {IModalInstanceOptions} from '../services/dialogs.interface';
//deps
import {BaseModelController} from './basemodelcontroller';
//#endregion

//#region BaseModal controller
class BaseModalController<TModel extends IBaseModel, TResult extends {}> extends BaseModelController<TModel> {
    //#region Bundle Services
    static injects = BaseModelController.injects.concat(['$uibModalInstance', 'instanceOptions']);
    protected $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance;
    /**
     * Instance Options
     */
    protected instanceOptions: IModalInstanceOptions<TModel>;
    /**
    * Update bundle
    * @param bundle IBundle
    */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);
        this.$uibModalInstance = bundle.systemBundles["$uibmodalinstance"];
        this.instanceOptions = bundle.systemBundles["instanceoptions"];
    }
    //#endregion

    //#region Init
    constructor(bundle: IBundle) {
        super(bundle);
        this.initModel();
    }

    //#endregion

    //#region Modal 
    /**
     * Close modal with result
     * @param data Result
     */
    modalResult(data: TResult): void {
        this.$uibModalInstance.close(data || this.instanceOptions.model);
    }
    /**
     * Close modal with dismiss
     */
    closeModal(): void {
        this.$uibModalInstance.dismiss();
    }
    //#endregion

    //#region BaseModelController
    /**
     * Get model
     */
    getModel(): ng.IPromise<TModel> {
        return this.common.makePromise<TModel>(this.instanceOptions.model);
    }

    //#endregion
}
//#endregion

export {BaseModalController}