//#region Imports
import {BadgeTypes} from '../services/titlebadges.service';
import {ITitleBadge, ITitleBadges} from '../services/titlebadges.interface';
import {IBaseCrudModel, IBundle, ICrudPageStateParams, ICrudPageOptions, ICrudPageFlags, ModelStates,
    IBaseFormModelFilter, NavigationDirection, ICrudPageLocalization, ISaveOptions,
    IValidationItem, IValidationResult, ICrudParsers, IParserException, CrudType, IDeleteOptions} from "./interfaces"
import {ICrudServerResponse, IServerFailedResponse} from '../services/common.interface';
import {INotification, LogType} from '../services/logger.interface';
import {IRotaState} from '../services/routing.interface';
//deps
import {BaseFormController} from './baseformcontroller';
import * as _ from 'underscore';

//#endregion
/**
 * Base CRUD page implementing save,update,delete processes
 * @description This base class should be inherited for all controllers using restful services
 * @abstract This is abstract controller class that must be inherited
 * @example This controller must be used with main state view because this controller is in interaction with badges and notifications
 * For nested state,use BaseFormController instead
 * @param {TModel} is your custom model view.
 */
abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseFormController<TModel> {
    //#region Props
    /**
    * Crud page options
    */
    private crudPageOptions: ICrudPageOptions;
    /**
     * Crud page flags
     */
    protected crudPageFlags: ICrudPageFlags;
    /**
    * Navigation buttons enabled flags
    */
    private navButtonsEnabled: { [index: number]: boolean };
    /**
     * Localized values for crud page
     */
    protected static localizedValues: ICrudPageLocalization;
    /**
     * Crud page state params
     */
    protected $stateParams: ICrudPageStateParams<TModel>;   
    /**
     * Stored model to be restored when reverting
     */
    private orjModel: TModel;
    //#endregion    

    //#region Init
    constructor(bundle: IBundle, options?: ICrudPageOptions) {
        const crudOptions = angular.extend({ initializeModel: false }, options);
        //call base constructor
        super(bundle, crudOptions);
        //set default options
        const parsers: ICrudParsers = {
            saveParsers: [this.checkAuthority, this.applyValidatitons, this.beforeSaveModel],
            deleteParsers: [this.checkAuthority, this.applyValidatitons, this.beforeDeleteModel]
        };
        this.crudPageOptions = this.common.extend<ICrudPageOptions>({ parsers: parsers }, options);
        this.crudPageFlags = { isCloning: false, isDeleting: false, isSaving: false };       
        //initialize getting model
        this.initModel();
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
     * Initialize new model
     * @param cloning Cloning flag
     */
    initNewModel(cloning?: boolean): ng.IPromise<TModel> {
        //chnage url
        const changeUrlPromise = this.changeUrl(BaseCrudController.newItemFieldValue);
        return changeUrlPromise.then(() => {
            this.isNew = true;
            (this.notification as INotification).removeAll();

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
        return super.newModel();
    }
    /**
     * Reset form
     * @description Set modelState param and form to pristine state
     * @param model Model
     */
    protected resetForm(model?: TModel): void {
        super.resetForm(model);
        if (!this.isNew && this.isAssigned(model)) {
            this.orjModel = angular.copy(model);
        }
    }
    /**
     * Revert back all changes 
     */
    private revertBack(): void {
        this.model = angular.extend(this.model, this.orjModel);
        this.resetForm(this.model);
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
        (this.notification as INotification).removeAll();
        //save process
        const deferSave = this.$q.defer<TModel>();
        //validate and save model if valid
        const saveModelResult = this.parseAndSaveModel(options);
        if (this.common.isAssigned(saveModelResult)) {
            saveModelResult.then((model: TModel) => {
                //call aftersave method
                const afterSaveModelResult = this.afterSaveModel(options);
                this.common.makePromise(afterSaveModelResult).then(() => {
                    //change url new --> edit
                    this.changeUrl(model.id).then(() => {
                        deferSave.resolve(model);
                        //set form to pristine and 
                        this.resetForm(model);
                    });
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
                this.crudPageFlags.isCloning =
                    this.crudPageFlags.isSaving = false;
            });
        } else {
            deferSave.reject('no response returned');
        }
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
        if (this.common.isAssigned(parseResult)) {
            parseResult.then(() => {
                //call user savemodel method
                const saveResult = this.saveModel(options);
                if (this.common.isAssigned(saveResult)) {
                    //success
                    saveResult.then((response: ICrudServerResponse) => {
                        if (!this.common.isAssigned(response)) {
                            defer.reject('no response returned');
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
                        //model is not 'new' anymore
                        this.isNew = false;
                        //set model from result of saving
                        this.model = <TModel>response.model;
                        defer.resolve(<TModel>response.model);
                    });
                    //fail save
                    saveResult.catch((response: IServerFailedResponse) => {
                        this.errorModel(response);
                        defer.reject(response);
                    });
                } else {
                    defer.reject('no response returned');
                }
            });
            //fail parsers
            parseResult.catch((response: IServerFailedResponse) => {
                defer.reject(response);
            });
        } else {
            defer.reject('no response returned');
        }
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

        return super.initModel();
    }
    /**
     * Set model getter method
     * @param modelFilter Model Filter
     * @description Overriden baseFormController's to pass cloned copy
     */
    defineModel(modelFilter?: IBaseFormModelFilter): ng.IPromise<TModel> | TModel {
        return this.isNew ? this.newModel(this.crudPageFlags.isCloning && <TModel>this.model) : this.getModel(modelFilter);
    }
    /**
     * Do some stuff after model loaded
     * @param model Model
     */
    loadedModel(model: TModel): void {
        super.loadedModel(model);
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
            //set form dirty when cloning
            this.rtForm.$setDirty();
        }
    }
    /**
    * @abstract Get model
    * @param args Model
    */
    abstract getModel(modelFilter: IBaseFormModelFilter): ng.IPromise<TModel> | TModel;
    //#endregion   
}
//Export
export {BaseCrudController}