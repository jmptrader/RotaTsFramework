//#region Imports
import {IBundle, IFormPageOptions, IBaseCrudModel, IValidationItem, IValidationResult,
    IBaseModelFilter, IFormPageFlags, ModelStates, IFormPageStateParams} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';
//#endregion

/**
 * BaseFormController
 * @description Some workarounds applied so that form controller would not be undefined
 * 1 - ng-init added on rtForm to initialize th formScope through initFormScope
 * https://stackoverflow.com/questions/21574472/angularjs-cant-access-form-object-in-controller-scope/21574537#21574537
 * 2 - formController set to object ref from primitive
 * 3 - Dirty watch set to  $scope.$watch('rtForm.$dirty',..)  in BaseCrudController
 * 4 - Some checks added to null controller as is isFormDirty
 * @abstract This is abstract controller class that must be inherited
 * @example This controller must be used with nested state views
 * @param {TModel} is your custom model view. * 
 */
abstract class BaseFormController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {
    //#region Props
    /**
    * New item id param value default name
    */
    protected static newItemFieldValue = 'new';
    /**
     * New item id param default name
     */
    protected static newItemFieldName = 'id';
    /**
    * Model object
    * @returns {TModel}
    */
    get model(): TModel { return <TModel>this._model; }
    set model(value: TModel) { this._model = value; }
    /**
     * Get id value
     * @description should be 'new' for new mode and number for edit mode
     * @returns {string | number} 
     */
    get id(): string | number {
        const idValue = this.$stateParams[this.formPageOptions.newItemFieldName];
        return this.isNew ? idValue : parseInt(idValue);
    }
    /**
    * Get if the page is in new state mode
    * @returns {boolean} 
    */
    get isNew(): boolean { return this.formPageFlags.isNew; }
    set isNew(value: boolean) {
        this.formPageFlags.isNew = value;
    }
    /**
     * Crud page state params
     */
    protected $stateParams: IFormPageStateParams<TModel>;
    /**
    * Custom Validators
    */
    protected validators: IValidationItem[];
    /**
     * Page options
     */
    protected formPageFlags: IFormPageFlags;
    /**
     * Base page optinns
     */
    protected formPageOptions: IFormPageOptions;

    //#region Form methods
    /**
    * Default form element name
    * @description if no custom form name defined,default rtForm will be used
    */
    private static defaultFormName: string = 'rtForm';
    /**
     * Form Scope
     * @description Initialized by initFormScope from rtForm directive
     */
    private formScope: any;
    /**
     * Main form controller used with rtForm form directive
     */
    get rtForm(): ng.IFormController {
        if (!this.common.isAssigned(this.formScope)) return undefined;
        return this.formScope[this.formPageOptions.formName];
    }
    /**
     * Flag that if form is dirty
     * @returns {boolean} 
     */
    get isFormDirty(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm.$dirty;
    }
    /**
     * Flag that if form is valid
     * @returns {boolean} 
     */
    get isFormValid(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return true;
        return this.rtForm.$valid;
    }
    /**
     * Flag that if form is invalid
     * @returns {boolean} 
     */
    get isFormInvalid(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm.$invalid;
    }
    /**
     * Flag that if form is pristine
     * @returns {boolean} 
     */
    get isFormPristine(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm.$pristine;
    }
    /**
     * Flag that if form is pending
     * @returns {boolean} 
     */
    get isFormPending(): boolean {
        if (!this.common.isAssigned(this.rtForm)) return false;
        return this.rtForm['$pending'];
    }
    //#endregion
    //#endregion

    //#region Methods
    /**
    * Chnage url depending on new/edit modes
    * @param id "New" or id 
    */
    protected changeUrl(id: number | string): ng.IPromise<any> {
        //get id param obj
        const idParam = {};
        idParam[this.formPageOptions.newItemFieldName] = id;
        //replace the url with new id
        const params = this.common.extend(this.$stateParams, idParam);
        return this.routing.go(this.routing.current.name, params,
            { notify: false, reload: false });
    }
    /**
     * Reset form
     * @description Set modelState param and form to pristine state
     * @param model Model
     */
    protected resetForm(model?: TModel): void {
        this.isNew ? this.setModelAdded() : this.setModelUnChanged();
        //check form controller initialized
        if (this.common.isAssigned(this.rtForm)) {
            this.rtForm.$setPristine();
        }
    }
    /**
     * Initialize new model
     */
    protected initNewModel(): ng.IPromise<TModel> {
        //chnage url
        const changeUrlPromise = this.changeUrl(BaseFormController.newItemFieldValue);
        return changeUrlPromise.then(() => {
            this.isNew = true;
            return this.initModel();
        });
    }
    /**
     * New model event
     */
    protected newModel(): ng.IPromise<TModel> | TModel {
        const uniqueId = this.formPageOptions.generateNewItemValue ? this.common.getUniqueNumber() : 0;
        return <TModel>{ id: uniqueId, modelState: ModelStates.Added };
    }
    /**
    * Form invalid flag changes
    * @param invalidFlag Invalid flag of main form
    * @description virtual method should be overriden
    */
    protected onFormInvalidFlagChanged(invalidFlag: boolean): void { }
    /**
    * Form dirty flag changes
    * @param dirtyFlag Dirty flag of main form
    * @description virtual method should be overriden
    */
    protected onFormDirtyFlagChanged(dirtyFlag: boolean): void {
        if (!this.isNew && dirtyFlag) {
            //set model modified
            this.setModelModified();
        }
    }
    //#endregion

    //#region Init
    constructor(bundle: IBundle, options?: IFormPageOptions) {
        super(bundle, options);
        //merge options
        this.formPageOptions = this.common.extend<IFormPageOptions>(
            {
                formName: BaseFormController.defaultFormName,
                newItemFieldName: BaseFormController.newItemFieldName,
                newItemFieldValue: BaseFormController.newItemFieldValue,
                generateNewItemValue: true
            }, options);
        this.formPageFlags = { isNew: true };
        //set form is new/edit mode
        this.isNew = this.id === this.formPageOptions.newItemFieldValue;
        //set form watchers
        this.$scope.$watch(`${this.formPageOptions.formName}.$dirty`, (newValue?: boolean) => {
            this.onFormDirtyFlagChanged(!!newValue);
        });
        this.$scope.$watch(`${this.formPageOptions.formName}.$invalid`, (newValue?: boolean) => {
            this.onFormInvalidFlagChanged(!!newValue);
        });
        //reset validators
        this.validators = [];
        //initialize getting model,initializeModel is false when basecrudcontroller is used
        if (this.modelPageOptions.initializeModel) {
            this.initModel();
        }
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

    //#region BaseModelController
    /**
     * Init crud model
     */
    protected initModel(): ng.IPromise<TModel> {
        return super.initModel({ id: this.id });
    }
    /**
    * Set model getter method
    * @param modelFilter Model Filter
    */
    defineModel(modelFilter?: IBaseModelFilter): ng.IPromise<TModel> | TModel {
        return this.isNew ? this.newModel() : this.getModel(modelFilter);
    }
    /**
    * Do some stuff after model loaded
    * @param model Model
    */
    loadedModel(model: TModel): void {
        //after model loaded,set form pristine and set modelState
        this.resetForm(model);
    }
    /**
    * @abstract Get model
    * @param args Model
    */
    abstract getModel(modelFilter: IBaseModelFilter): ng.IPromise<TModel> | TModel;
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

export {BaseFormController}