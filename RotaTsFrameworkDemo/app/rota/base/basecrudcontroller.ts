import {BadgeTypes} from '../services/titlebadges.service';
import {ITitleBadge, ITitleBadges} from '../services/titlebadges.interface';
import {IBaseCrudModel, IBundle, IModelStateParams, ICrudPageOptions, ICrudPageFlags, ModelStates,
    IBaseCrudModelFilter, NavigationDirection} from "./interfaces"
import {INotification} from '../services/logger.interface';
import {IRotaState} from '../services/routing.interface';
//deps
import {BaseModelController} from './basemodelcontroller';


abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {

    //#region Props
    /**
     * New item id param value name
     */
    private static newItemParamName = 'new';

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
        this.crudPageOptions = angular.extend({}, options);
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

        //initialize getting model
        this.initModel();
    }
    /**
    * Update bundle
    * @param bundle IBundle
    */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);
        this.titlebadges = bundle["titlebadges"];
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

    //#region BaseCrudController Methods
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
        //Id new olarak tekrar yukle
        this.changeUrl(BaseCrudController.newItemParamName);
        //Yeni kayit
        this.isNew = true;
        //Clear notf
        (<INotification>this.notification).removeAll();
        //Eger kopyalama yapılıyorsa tum degişiklikleri iptal et
        if (cloning) {
            this.revertBack();
        }
        //Init
        return this.initModel(cloning);
    }
    /**
     * Reset form
     * @description Set modelState param and form to pristine state
     * @param model Model
     */
    private resetForm(model: TModel): void {
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
            this.notification.error({ message: this.localization.getLocal("rota.modelbulunamadi") });
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
            this.toastr.info({ message: this.localization.getLocal('rota.kayitkopyalandı') });
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




    //abstract save(model: TModel): ng.IPromise<TModel>;
    //abstract deleteById(id: number): ng.IPromise<any>;
}
//Export
export {BaseCrudController}