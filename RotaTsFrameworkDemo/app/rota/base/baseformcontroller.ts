//#region Imports
import {IBundle, IFormPageOptions, IValidationItem, IValidationResult} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';
//#endregion

//#region BaseFormController
abstract class BaseFormController<TModel> extends BaseModelController<TModel> {
    //#region Props
    /**
    * Csutom Validators
    */
    protected validators: IValidationItem[];
    /**
     * Default form element name
     */
    private static defaultFormName: string = 'rtForm';
    /**
     * Form Scope
     */
    formScope: any;
    /**
     * Base page optinns
     */
    formPageOptions: IFormPageOptions;
    /**
     * Main form controller used with rtForm form directive
     */
    get rtForm(): ng.IFormController {
        if (!this.common.isAssigned(this.formScope)) return undefined;
        return this.formScope[this.formPageOptions.formName];
    }

    get isFormDirty(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm.$dirty;
    }

    get isFormValid(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return true;
        return this.rtForm.$valid;
    }

    get isFormInvalid(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm.$invalid;
    }

    get isFormPristine(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm.$pristine;
    }

    get isFormPending(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm['$pending'];
    }
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
        super(bundle, options);
        //options
        this.formPageOptions = this.common.extend<IFormPageOptions>({ formName: BaseFormController.defaultFormName }, options);
        this.validators = [];
        //set form watchers
        this.$scope.$watch(`${this.formPageOptions.formName}.$dirty`, (newValue: boolean) => {
            if (newValue !== undefined) {
                this.onFormDirtyFlagChanged(newValue);
            }
        });
        this.$scope.$watch(`${this.formPageOptions.formName}.$invalid`, (newValue: boolean) => {
            this.onFormInvalidFlagChanged(newValue);
        });
    }
    /**
    * Initiliaze form controller using form scope object
    * @param forms
    * @description this is a hack method to prevent form controller being undefined
    * formScope is set from rtForm directive
    */
    initFormScope(formScope: ng.IScope): void {
        this.formScope = formScope;
    }
    //#endregion

    //#region Validations
    /**
     * Add new validation
     * @param item Validation Item
     * @description Adding order will be used if not order prop defined,
     * name prop is handy for dynamic validation enable/disable etc
     */
    addValidation(item: IValidationItem): void {
        if (!item.func)
            throw new Error('func should not be null');

        if (!item.order) {
            item.order = this.validators.length + 1;
        }

        if (!item.enabled) {
            item.enabled = true;
        }
        this.validators.push(item);
    }
    /**
     * Get validation object by name
     * @param name Validation name
     */
    getValidation(name: string): IValidationItem {
        return _.findWhere(this.validators, { name: name });
    }
    /**
     * Remove validation by name
     * @param name Validation name
     */
    removeValidation(name: string): void {
        const validator = _.findWhere(this.validators, { name: name });
        const validatorIndex = this.validators.indexOf(validator);

        if (validatorIndex > -1) {
            this.validators.slice(validatorIndex, 1);
        }
    }
    /**
     * This method is called internally as validation pipline in process
     * @returns it will return failed validation result if any
     * @description Validators is sorted and filtered by enabled prop
     */
    protected applyValidations(validators?: IValidationItem[]): ng.IPromise<any> {
        //filter
        const validatorsToApply = validators || this.validators;
        const filteredValidators = _.where(validatorsToApply, { enabled: true });
        const sortedValidators = _.sortBy(filteredValidators, 'order');
        //run 
        return this.runChainableValidations(sortedValidators);
    }
    /**
     * This method is called internally to get run all validators
     * @param validators Registered validators
     */
    private runChainableValidations(validators: IValidationItem[]): ng.IPromise<any> {
        let result = this.common.promise();
        //iterate chainable methods
        for (let i = 0; i < validators.length; i++) {
            result = ((promise: ng.IPromise<any>, validator: IValidationItem) => {
                return promise.then(() => {
                    return validator.func.call(this, validator);
                });
            })(result, validators[i]);
        }
        return result;
    }
    //#endregion
}
//#endregion
export {BaseFormController}