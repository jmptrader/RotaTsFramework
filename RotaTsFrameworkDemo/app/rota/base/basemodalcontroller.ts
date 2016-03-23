//#region Imports
import {IBaseCrudModel, IBundle, IBaseModelFilter, ModelStates} from "./interfaces"
import {IModalInstanceOptions} from '../services/dialogs.interface';
//deps
import {BaseFormController} from './baseformcontroller';
//#endregion

//#region BaseModal controller
class BaseModalController<TModel extends IBaseCrudModel, TResult extends {}> extends BaseFormController<TModel> {
    //#region Bundle Services
    static injects = BaseFormController.injects.concat(['$uibModalInstance', 'instanceOptions']);
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
        this.$uibModalInstance.close(data);
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

    //#region BaseFormController methods
    /**
     * Form invalid flag changes
     * @param invalidFlag Invalid flag of main form
     */
    onFormInvalidFlagChanged(invalidFlag: boolean): void {
    }
    /**
     * Form dirty flag changes
     * @param dirtyFlag Dirty flag of main form
     */
    onFormDirtyFlagChanged(dirtyFlag: boolean): void {
        this.setModelModified();
    }
    //#endregion
}

//#endregion

export {BaseModalController}