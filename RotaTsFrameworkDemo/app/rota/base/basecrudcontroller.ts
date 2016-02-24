import {BadgeTypes} from '../services/titlebadges.service';
import {ITitleBadge, ITitleBadges} from '../services/titlebadges.interface';
import {IBaseCrudModel, IBundle, IModelStateParams, ICrudPageOptions, ICrudPageFlags, ModelStates,
    IBaseCrudModelFilter, NavigationDirection, ICrudPageLocalization, ISaveOptions,
    IValidationItem, ISavePipelineMethod, IPipeline, IBasePipelineMethod} from "./interfaces"
import {INotification} from '../services/logger.interface';
import {IRotaState} from '../services/routing.interface';
//deps
import {BaseModelController} from './basemodelcontroller';
import * as _ from 'underscore';

abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {
    //#region Props
    /**
     * New item id param value name
     */
    private static newItemParamName = 'new';
    /**
     * Localized values for crud page
     */
    private static localizedValues: ICrudPageLocalization;

    protected $stateParams: IModelStateParams;
    private crudPageOptions: ICrudPageOptions;
    private crudPageFlags: ICrudPageFlags;
    navButtonsEnabled: { [index: number]: boolean };

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
        const defaultPipeline: IPipeline = {
            savePipelines: [this.applyValidatiton, this.checkAuthority, this.beforeSaveModel]
        };
        this.crudPageOptions = angular.extend({ pipeline: defaultPipeline }, options);
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
                    //Stop transition
                    event.preventDefault();
                    //Confirm
                    this.dialogs.showConfirm({ message: BaseCrudController.localizedValues.crudonay }).then(() => {
                        //Modeli kaydet
                        //self.initSaveModel().then(function () {
                        //    //Burdaki resetFrom fazlami ?
                        //    self.resetForm();
                        //    self.go(toState.name, toParams);
                        //});
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
            validationhatasi: this.localization.getLocal('rota.validationhatasi')
        };
    }
    //#endregion

    //#region ModelState Methods
    /**
     * Set model state to Modified
     * @param model Model
     */
    setModelModified(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Modified, false);
    }
    /**
     * Set model state to Deleted
     * @param model Model
     */
    setModelDeleted(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Deleted);
    }
    /**
     * Set model state to Added
     * @param model Model
     */
    setModelAdded(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Added);
    }
    /**
     * Set model state to Changed
     * @param model Model
     */
    setModelUnChanged(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Unchanged);
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
            return clonedModel;
        }
        return <TModel>{ id: 0 };
    }
    /**
     * Reset form
     * @description Set modelState param and form to pristine state
     * @param model Model
     */
    private resetForm(model?: TModel): void {
        this.isNew ? this.setModelAdded() : this.setModelUnChanged();
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

    initPipeline(pipeline: Array<IBasePipelineMethod | ISavePipelineMethod>, ...params: any[]): ng.IPromise<any> {
        let result = this.common.promise();
        //iterate pipeline methods
        for (let i = 0; i < pipeline.length; i++) {
            result = ((r: ng.IPromise<any>, method: IBasePipelineMethod) => {
                return r.then(() => method.apply(this, params), (reason: string) => {
                    this.errorModel(reason);
                    return this.common.rejectedPromise(reason);
                });
            })(result, <IBasePipelineMethod>pipeline[i]);
        }
        return result;
    }

    initSaveModel(options?: ISaveOptions): ng.IPromise<TModel> {
        //init saving
        options = angular.extend({ isNew: this.isNew, goon: false, showMessage: true, model: this.model }, options);
        this.crudPageFlags.isSaving = true;
        (<INotification>this.notification).removeAll();

        const defer = this.$q.defer();
        //iterate save pipeline
        const result = this.initPipeline(this.crudPageOptions.pipeline.savePipelines, options);

        result.then(() => {
            defer.resolve();
            debugger;
        }, () => {
            defer.reject();
            debugger;
        });

        return defer.promise;
    }




    beforeSaveModel(options: ISaveOptions): ng.IPromise<any> {
        this.console.log({ message: 'beforeSaveModel works' });
        return this.common.rejectedPromise('fdfqwe');
    }

    afterSaveModel(options: ISaveOptions): ng.IPromise<any> {
        this.console.log({ message: 'afterSaveModel works' });
        return this.common.promise();
    }
    //abstract saveModel(model: TModel): ng.IPromise<TModel>;
    //#endregion

    //#region Validation
    private applyValidatiton(options: ISaveOptions): ng.IPromise<any> {
        const errors: IValidationItem[] = [];
        let message = '<ul>';
        const defered = this.$q.defer();

        if (this.crudPageFlags.isDeleting) {
            defered.resolve(errors);
            return defered.promise;
        }
        const validationPromise = this.common.makePromise<IValidationItem[]>(this.validateModel(errors, options));
        validationPromise.then((e: IValidationItem[]) => {
            if (e.length) {
                e.forEach(err => {
                    message += '<li>' + err.message + '</li>';
                });
                message += '</ul>';

                defered.reject(message);
            } else {
                defered.resolve();
            }
        }, () => {
            defered.reject();
        });
        return defered.promise;
    }

    validateModel(errors: IValidationItem[], options: ISaveOptions): ng.IPromise<IValidationItem[]> {
        return this.common.promise(errors);
    }
    //#endregion

    //#region Authorization
    checkAuthority(options?: ISaveOptions): ng.IPromise<any> {
        return this.common.promise();
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
        if (!this.isNew && !this.isAssigned(model)) {
            //Hata ver
            this.notification.error({ message: BaseCrudController.localizedValues.modelbulunamadi });
            //Yeni moda gec
            this.initNewModel();
            return;
        }
        //Model yuklendikten sonra modeli resetleyip yedekle revert icin
        this.resetForm(model);
        //set navbuttons enable
        this.navButtonsEnabled = {
            next: !!this.getNavModel(NavigationDirection.Next),
            prev: !!this.getNavModel(NavigationDirection.Prev)
        }
        //set cloning warning & notify
        if (this.crudPageFlags.isCloning) {
            this.toastr.info({ message: BaseCrudController.localizedValues.kayitkopyalandi });
            this.cloningBadge.show = true;
        }
    }
    /**
   * @abstract Get model
   * @param args Model
   */
    abstract getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<TModel> | TModel;
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





    //abstract deleteById(id: number): ng.IPromise<any>;
}
//Export
export {BaseCrudController}