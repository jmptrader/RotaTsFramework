//#region Imports
import {BadgeTypes} from '../services/titlebadges.service';
import {ITitleBadge, ITitleBadges} from '../services/titlebadges.interface';
import {IBaseCrudModel, IBundle, ICrudPageStateParams, ICrudPageOptions, ICrudPageFlags, ModelStates,
    IBaseCrudModelFilter, NavigationDirection, ICrudPageLocalization, ISaveOptions,
    IValidationItem, IValidationResult, ICrudParsers, IParserException, CrudType, IDeleteOptions} from "./interfaces"
import {ICrudServerResponse, IServerFailedResponse} from '../services/common.interface';
import {INotification, LogType} from '../services/logger.interface';
import {IRotaState} from '../services/routing.interface';
//deps
import {BaseModelController} from './basemodelcontroller';
import * as _ from 'underscore';

//#endregion
/**
 * Base CRUD page implementing save,update,delete processes
 * @description This base class should be inherited for all controllers using restful services
 * @param {TModel} is your custom model view.
 */
abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {
    //#region Props
    /**
   * Model object
   * @returns {TModel}
   */
    get model(): TModel { return <TModel>this._model; }
    set model(value: TModel) { this._model = value; }
    /**
     * New item id param value name
     */
    private static newItemParamName = 'new';
    /**
     * Localized values for crud page
     */
    private static localizedValues: ICrudPageLocalization;
    /**
     * Crud page state params
     */
    protected $stateParams: ICrudPageStateParams;
    /**
     * Crud page options
     */
    private crudPageOptions: ICrudPageOptions;
    /**
     * Crud page flags
     */
    private crudPageFlags: ICrudPageFlags;
    /**
     * Navigation buttons enabled flags
     */
    private navButtonsEnabled: { [index: number]: boolean };

    /**
     * Stored model to be restored when reverting
     */
    private orjModel: TModel;
    /**
    * Get if the page is in new state mode
    * @returns {boolean} 
    */
    get isNew(): boolean { return this.crudPageFlags.isNew; }
    set isNew(value: boolean) {
        this.crudPageFlags.isNew = value;
        this.editmodeBadge.show = !value;
        this.newmodeBadge.show = value;
    }

    //#region Badge Shortcuts
    /**
   * Edit Mode badge
   * @returns {ITitleBadge}
   */
    get editmodeBadge(): ITitleBadge {
        return this.titlebadges.badges[BadgeTypes.Editmode];
    }
    /**
    * New Mode badge
    * @returns {ITitleBadge}
    */
    get newmodeBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Newmode]; }
    /**
    * Dirty badge
    * @returns {ITitleBadge}
    */
    get dirtyBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Dirty]; }
    /**
    * Invalid badge
    * @returns {ITitleBadge}
    */
    get invalidBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Invalid]; }
    /**
    * Copying badge
    * @returns {ITitleBadge}
    */
    get cloningBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Cloning]; }

    //#endregion

    //#endregion

    //#region Bundle Services
    static injects = BaseModelController.injects.concat(['TitleBadges']);
    protected titlebadges: ITitleBadges;
    //#endregion

    //#region Init
    constructor(bundle: IBundle, options?: ICrudPageOptions) {
        super(bundle);
        //set default options
        const parsers: ICrudParsers = {
            saveParsers: [this.checkAuthority, this.applyValidatitons, this.beforeSaveModel],
            deleteParsers: [this.checkAuthority, this.applyValidatitons, this.beforeDeleteModel]
        };
        this.crudPageOptions = this.common.extend<ICrudPageOptions>({ parsers: parsers }, options);
        this.crudPageFlags = { isNew: true, isCloning: false, isDeleting: false, isSaving: false };
        this.isNew = this.$stateParams.id === BaseCrudController.newItemParamName;
        //set form watchers
        this.$scope.$watch(() => this.rtForm.$dirty, (newValue) => {
            if (newValue !== undefined) {
                this.dirtyBadge.show = newValue;
                if (!this.isNew && newValue) {
                    this.setModelModified();
                }
            }
        });
        this.$scope.$watch(() => this.rtForm.$invalid, (newValue) => {
            this.invalidBadge.show = newValue;
        });
        //register 'catch changes while exiting'
        this.registerEvent('$stateChangeStart',
            (event: ng.IAngularEvent, toState: IRotaState, toParams: ng.ui.IStateParamsService, fromState: IRotaState) => {
                if (toState.hierarchicalMenu &&
                    toState.name !== fromState.name &&
                    this.rtForm.$dirty && this.rtForm.$valid) {
                    event.preventDefault();
                    this.dialogs.showConfirm({ message: BaseCrudController.localizedValues.crudonay }).then(() => {
                        //save and go to state
                        this.initSaveModel().then(() => {
                            this.routing.go(toState.name, toParams);
                        });
                    }).catch(() => {
                        this.resetForm();
                        this.routing.go(toState.name, toParams);
                    });
                }
            });
        //initialize getting model
        this.initModel();
    }
    /**
    * Update bundle
    * @param bundle IBundle
    */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);
        this.titlebadges = bundle.systemBundles["titlebadges"];
    }
    /**
     * Store localized value for performance issues (called in basecontroller)
     */
    protected storeLocalization(): void {
        if (BaseCrudController.localizedValues) return;

        BaseCrudController.localizedValues = {
            crudonay: this.localization.getLocal('rota.crudonay'),
            kayitkopyalandi: this.localization.getLocal('rota.kayitkopyalandı'),
            modelbulunamadi: this.localization.getLocal('rota.modelbulunamadi'),
            succesfullyprocessed: this.localization.getLocal('rota.succesfullyprocessed'),
            validationhatasi: this.localization.getLocal('rota.validationhatasi'),
            bilinmeyenhata: this.localization.getLocal('rota.bilinmeyenhataolustu'),
            silmeonay: this.localization.getLocal('rota.deleteconfirm'),
            silmeonaybaslik: this.localization.getLocal('rota.deleteconfirmtitle')
        };
    }
    //#endregion

    //#region Model Methods
    /**
     * Chnage url depending on new/edit modes
     * @param id "New" or id 
     */
    private changeUrl(id: number | string): ng.IPromise<any> {
        return this.routing.go(this.routing.current.name, { id: id },
            { notify: false, reload: false });
    }
    /**
     * Initialize new model
     * @param cloning Cloning flag
     */
    initNewModel(cloning?: boolean): ng.IPromise<TModel> {
        //chnage url
        const changeUrlPromise = this.changeUrl(BaseCrudController.newItemParamName);
        return changeUrlPromise.then(() => {
            this.isNew = true;
            (<INotification>this.notification).removeAll();

            if (cloning) {
                this.revertBack();
            }
            //init model
            return this.initModel(cloning);
        });
    }
    /**
     * New model event
     * @param clonedModel Model to be cloned
     */
    newModel(clonedModel?: TModel): ng.IPromise<TModel> | TModel {
        if (clonedModel) {
            clonedModel.id = 0;
            clonedModel.modelState = ModelStates.Added;
            return clonedModel;
        }
        return <TModel>{ id: 0, modelState: ModelStates.Added };
    }
    /**
     * Reset form
     * @description Set modelState param and form to pristine state
     * @param model Model
     */
    private resetForm(model?: TModel): void {
        this.isNew ? this.setModelAdded() : this.setModelUnChanged();
        //TODO:rtForm is undefined somtimes,why ?
        this.rtForm.$setPristine();

        if (!this.isNew && this.isAssigned(model)) {
            this.orjModel = angular.copy(model);
        }
    }
    /**
     * Revert back all changes 
     */
    private revertBack(): void {
        this.model = angular.extend(this.model, this.orjModel);
        this.resetForm(<TModel>this.model);
    }
    //#endregion

    //#region Save Methods
    /**
     * Save model and continue to saving new model
     */
    initSaveAndContinue(): ng.IPromise<TModel> {
        const saveModelResult = this.initSaveModel({ goon: true });
        return saveModelResult.then(() => {
            return this.initNewModel();
        });
    }
    /**
     * Save Model 
     * @param options Save Options     
     */
    initSaveModel(options?: ISaveOptions): ng.IPromise<TModel> {
        //init saving
        options = angular.extend({
            isNew: this.isNew, goon: false,
            showMessage: true, model: this.model
        }, options);
        this.crudPageFlags.isSaving = true;
        (<INotification>this.notification).removeAll();
        //save process
        const deferSave = this.$q.defer<TModel>();
        //validate and save model if valid
        const saveModelResult = this.parseAndSaveModel(options);
        saveModelResult.then((model: TModel) => {
            //call aftersave method
            const afterSaveModelResult = this.afterSaveModel(options);
            this.common.makePromise(afterSaveModelResult).then(() => {
                //change url new --> edit
                this.changeUrl(model.id).then(() => { deferSave.resolve(model); });
            }, (response: IServerFailedResponse) => {
                //if afterSaveModel failed
                this.errorModel(response);
                deferSave.reject(response);
            });
        }, (reason) => {
            //save or validation failed
            deferSave.reject(reason);
        });
        saveModelResult.finally(() => {
            if (this.crudPageFlags.isCloning)
                this.cloningBadge.show = false;
            this.crudPageFlags.isCloning =
                this.crudPageFlags.isSaving = false;
        });
        //return
        return deferSave.promise;
    }
    /**
     * Validate parsers methods and call save method
     * @param options Save options
     */
    private parseAndSaveModel(options: ISaveOptions): ng.IPromise<TModel> {
        const defer = this.$q.defer<TModel>();
        //iterate save pipeline
        const parseResult = this.initParsers<any>(this.crudPageOptions.parsers.saveParsers, options);
        //save if validation parsers resolved
        parseResult.then(() => {
            //call user savemodel method
            const saveResult = this.saveModel(options);
            //success
            saveResult.then((response: ICrudServerResponse) => {
                if (!this.common.isAssigned(response)) {
                    defer.reject("response must be defined");
                    return;
                }
                //show messages
                if (options.showMessage) {
                    this.toastr.success({ message: BaseCrudController.localizedValues.succesfullyprocessed });
                    if (response.infoMessages)
                        this.toastr.info({ message: response.infoMessages.join('</br>') });
                    if (response.warningMessages)
                        this.toastr.warn({ message: response.warningMessages.join('</br>') });
                }
                //set entity from result of saving
                this.isNew = false;
                this.model = <TModel>response.model;
                defer.resolve(<TModel>response.model);
            });
            //fail save
            saveResult.catch((response: IServerFailedResponse) => {
                this.errorModel(response);
                defer.reject(response);
            });
        });
        //fail parsers
        parseResult.catch((response: IServerFailedResponse) => {
            defer.reject(response);
        });
        return defer.promise;
    }
    /**
     * Before save event
     * @param options Save options
     */
    beforeSaveModel(options: ISaveOptions): ng.IPromise<any> { return this.common.promise(); }
    /**
     * After save event
     * @param options Save options
     */
    afterSaveModel(options: ISaveOptions): ng.IPromise<any> { return this.common.promise(); }
    /**
     * Save model
     * @param options Save options
     */
    abstract saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse>;
    //#endregion

    //#region Validation
    private applyValidatitons(options: ISaveOptions): ng.IPromise<any> {
        const resultDefer = this.$q.defer();
        //filter by crud flag
        const validatorsFilteredByCrudFlag = _.filter(this.validators, (item: IValidationItem) => {
            if (!item.crudFlag)
                return true;
            if ((this.crudPageFlags.isSaving && options.isNew && item.crudFlag & CrudType.Create) ||
                (this.crudPageFlags.isSaving && !options.isNew && item.crudFlag & CrudType.Update) ||
                (this.crudPageFlags.isDeleting && item.crudFlag & CrudType.Delete)) {
                return true;
            }
            return false;
        });
        //apply validations
        const validationResult = super.applyValidations(validatorsFilteredByCrudFlag);
        //convert pipiline exception
        validationResult.then(() => { resultDefer.resolve(); }, (reason: IValidationResult) => {
            let msg = BaseCrudController.localizedValues.bilinmeyenhata;
            if (reason) {
                msg = reason.message || (reason.messageI18N && this.localization.getLocal(reason.messageI18N));
            }
            resultDefer.reject({
                title: BaseCrudController.localizedValues.validationhatasi,
                logType: LogType.Warn,
                exceptionMessage: msg
            });
        });
        return resultDefer.promise;
    }
    //#endregion

    //#region Authorization
    checkAuthority(options?: ISaveOptions): ng.IPromise<any> {
        return this.common.promise();
    }
    //#endregion

    //#region Navigation
    /**
     * Init model navigation
     * @param direction Direction
     */
    initModelNav(direction: NavigationDirection) {
        return this.common.makePromise(this.getNavModel(direction)).then(currentId => {
            if (currentId && currentId !== (<TModel>this.model).id) {
                this.routing.go(this.routing.current.name, { id: currentId });
            }
        });
    }
    /**
     * Get current id depending on direction
     * @param direction Direction
     */
    getNavModel(direction: NavigationDirection): number | void {
        let currentId: number;
        const items = this.$stateParams.navItems;

        if (items && angular.isArray(items) && items.length > 0) {
            const currentIndex = items.indexOf((<TModel>this.model).id);
            switch (direction) {
                case NavigationDirection.Prev:
                    currentId = currentIndex > 0 && items[currentIndex - 1];
                    break;
                case NavigationDirection.Next:
                    currentId = (currentIndex < (items.length - 1)) && items[currentIndex + 1];
                    break;
            }
        }
        return currentId;
    }
    //#endregion

    //#region Delete Model
    /**
     * Init deletion of model
     * @param options Delete options
     */
    initDeleteModel(options: IDeleteOptions): ng.IPromise<any> {
        //init deleting
        options = angular.extend({
            key: this.model.id, confirm: true,
            showMessage: true, model: this.model
        }, options);
        //save process
        const deferDelete = this.$q.defer<TModel>();
        //confirm
        const confirmResult = options.confirm ? this.dialogs.showConfirm({
            message: BaseCrudController.localizedValues.silmeonay,
            title: BaseCrudController.localizedValues.silmeonaybaslik
        }) : this.common.promise();
        //confirm result
        confirmResult.then(() => {
            this.crudPageFlags.isDeleting = true;
            //validate and delete model if valid
            const parseResult = this.initParsers<any>(this.crudPageOptions.parsers.deleteParsers, options);
            parseResult.then(() => {
                //set modelstate as deleted
                this.setModelDeleted();
                //call delete method
                const deleteResult = this.deleteModel(options);
                //success
                deleteResult.then(() => {
                    //call aftersave method
                    const afterDeleteModelResult = this.afterDeleteModel(options);
                    this.common.makePromise(afterDeleteModelResult).then(() => {
                        deferDelete.resolve();
                    }, (response: IServerFailedResponse) => {
                        //if afterDeleteModel failed
                        this.errorModel(response);
                        deferDelete.reject(response);
                    });
                    //message
                    if (options.showMessage) {
                        this.toastr.success({ message: BaseCrudController.localizedValues.succesfullyprocessed });
                    }
                });
                //fail delete
                deleteResult.catch((response: IServerFailedResponse) => {
                    this.errorModel(response);
                    deferDelete.reject(response);
                });
            });
            //finally 
            parseResult.finally(() => {
                this.resetForm();
            });
        }, () => {
            //cancel confirm
            deferDelete.reject('user cancelled');
        });
        //set deleted flag
        confirmResult.finally(() => {
            this.crudPageFlags.isDeleting = false;
        });
        return deferDelete.promise;
    }
    /**
     * Before delete event
     */
    beforeDeleteModel(): ng.IPromise<any> { return this.common.promise(); }
    /**
     * After delete event
     * @param options
     */
    afterDeleteModel(options: IDeleteOptions): ng.IPromise<any> { return this.common.promise(); }
    /**
     * User delete method
     * @param options Delete options
     */
    abstract deleteModel(options: IDeleteOptions): ng.IPromise<any>;
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

    //#region BaseModelController Methods
    /**
     * Init crud model
     * @param cloning Cloning flag
     */
    protected initModel(cloning?: boolean): ng.IPromise<TModel> {
        //reset flags
        this.crudPageFlags.isSaving =
            this.crudPageFlags.isDeleting = false;
        this.crudPageFlags.isCloning = cloning;
        this.orjModel = null;

        return super.initModel({ id: this.$stateParams.id });
    }
    /**
     * Set model getter method
     * @param modelFilter Model Filter
     */
    defineModel(modelFilter?: IBaseCrudModelFilter): ng.IPromise<TModel> | TModel {
        return this.isNew ? this.newModel(this.crudPageFlags.isCloning && <TModel>this.model) : this.getModel(modelFilter);
    }
    /**
     * Do some stuff after model loaded
     * @param model Model
     */
    loadedModel(model: TModel): void {
        this.resetForm(model);
        //model not found in edit mode
        if (!this.isNew && !this.isAssigned(model)) {
            this.notification.error({ message: BaseCrudController.localizedValues.modelbulunamadi });
            this.initNewModel();
            return;
        }
        //set navbuttons enable
        this.navButtonsEnabled = {
            next: !!this.getNavModel(NavigationDirection.Next),
            prev: !!this.getNavModel(NavigationDirection.Prev)
        }
        //set cloning warning & notify
        if (this.crudPageFlags.isCloning) {
            this.toastr.info({ message: BaseCrudController.localizedValues.kayitkopyalandi });
            this.cloningBadge.show = true;
            //set form dirty when cloning
            this.rtForm.$setDirty();
        }
    }
    /**
    * @abstract Get model
    * @param args Model
    */
    abstract getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<TModel> | TModel;
    //#endregion

    //#region BaseFormController methods
    /**
     * Form invalid flag changes
     * @param invalidFlag Invalid flag of main form
     */
    onFormInvalidFlagChanged(invalidFlag: boolean): void {
        this.invalidBadge.show = invalidFlag;
    }
    /**
     * Form dirty flag changes
     * @param dirtyFlag Dirty flag of main form
     */
    onFormDirtyFlagChanged(dirtyFlag: boolean): void {
        this.dirtyBadge.show = dirtyFlag;
    }
    //#endregion
}
//Export
export {BaseCrudController}