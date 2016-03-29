//#region Imports
import {IBaseCrudModel, IBundle, ModelStates, IFormPageOptions} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';
import * as _ from 'underscore';
//#endregion

//#region BaseModal controller
abstract class BaseFormController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {
    //#region Props
    /**
    * Model object
    * @returns {TModel}
    */
    get model(): TModel { return <TModel>this._model; }
    set model(value: TModel) { this._model = value; }
    //#endregion

    //#region Init
    /**
   * Form invalid flag changes
   * @param invalidFlag Invalid flag of main form
   */
    abstract onFormInvalidFlagChanged(invalidFlag: boolean): void;
    /**
    * Form dirty flag changes
    * @param dirtyFlag Dirty flag of main form
    */
    abstract onFormDirtyFlagChanged(dirtyFlag: boolean): void;

    constructor(bundle: IBundle, options?: IFormPageOptions) {
        super(bundle);
        //watch form drity status
        this.$scope.$watch(() => this.rtForm.$dirty, (newValue) => {
            if (newValue !== undefined) {
                this.onFormDirtyFlagChanged(newValue);
            }
        });
        //watch form invalid status
        this.$scope.$watch(() => this.rtForm.$invalid, (newValue) => {
            this.onFormInvalidFlagChanged(newValue);
        });
        //watch model to set modelState to Modified
        this.$scope.$watch(() => this.model, (newValue, oldValue) => {
            if (this.common.isAssigned(oldValue) && this.common.isAssigned(newValue) &&
                newValue.modelState === oldValue.modelState &&
                newValue.modelState !== ModelStates.Modified) {
                this.setModelModified();
            }
        });
    }
    //#endregion

    //#region ModelState Methods
    /**
     * Set model state to Modified
     * @param model Model
     */
    setModelModified(model?: IBaseCrudModel) {
        return this.common.setModelState(model || this.model, ModelStates.Modified, false);
    }
    /**
     * Set model state to Deleted
     * @param model Model
     */
    setModelDeleted(model?: IBaseCrudModel) {
        return this.common.setModelState(model || this.model, ModelStates.Deleted);
    }
    /**
     * Set model state to Added
     * @param model Model
     */
    setModelAdded(model?: IBaseCrudModel) {
        return this.common.setModelState(model || this.model, ModelStates.Added);
    }
    /**
     * Set model state to Changed
     * @param model Model
     */
    setModelUnChanged(model?: IBaseCrudModel) {
        return this.common.setModelState(model || this.model, ModelStates.Unchanged);
    }
    //#endregion
}

//#endregion

export {BaseFormController}