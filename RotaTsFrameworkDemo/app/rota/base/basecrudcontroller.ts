import {BadgeTypes} from '../services/titlebadges.service';
import {ITitleBadge, ITitleBadges} from '../services/titlebadges.interface';
import {IBaseCrudModel, IBundle, IModelStateParams, ICrudPageOptions, ICrudPageFlags, ModelStates, IBaseCrudModelFilter} from "./interfaces"
//deps
import {BaseModelController} from './basemodelcontroller';


abstract class BaseCrudController<TModel extends IBaseCrudModel> extends BaseModelController<TModel> {

    //#region Props
    private static newItemParamName = 'new';

    $stateParams: IModelStateParams;
    crudPageOptions: ICrudPageOptions;
    crudPageFlags: ICrudPageFlags;

    private orjModel: TModel;
    /**
    * Edit Mode badge
    * @returns {ITitleBadge}
    */
    get editmodeBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Editmode]; }
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
     * Get if the page is in new state mode
     * @returns {boolean} 
     */
    get isNew(): boolean { return this.crudPageFlags.isNew; }
    set isNew(value: boolean) {
        this.crudPageFlags.isNew = value;

        this.editmodeBadge.show = !value;
        this.newmodeBadge.show = value;
    }

    //#endregion

    //#region Bundle Services
    static injects = BaseModelController.injects.concat(['TitleBadges']);
    protected titlebadges: ITitleBadges;
    //#endregion

    constructor(bundle: IBundle, options?: ICrudPageOptions) {
        super(bundle);
        //set default options
        this.crudPageOptions = angular.extend({}, options);
        this.crudPageFlags = { isNew: true, isCloning: false, isDeleting: false, isSaving: false };
        this.isNew = this.$stateParams.id === BaseCrudController.newItemParamName;
        //set form watchers
        this.$scope.$watch(() => this.rtForm.$dirty, (newValue) => {
            if (newValue !== undefined) {
                this.dirtyBadge.show = true;

                if (!this.isNew) {
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

    //#region ModelState Methods
    setModelModified(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Modified, false);
    }

    setModelDeleted(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Deleted);
    }

    setModelAdded(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Added);
    }

    setModelUnChanged(model?: IBaseCrudModel) {
        return this.common.setModelState(model || <TModel>this.model, ModelStates.Unchanged);
    }
    //#endregion

    //#region Model Methods
    initModel(cloning?: boolean): ng.IPromise<TModel> {
        this.crudPageFlags.isSaving =
            this.crudPageFlags.isDeleting = false;
        this.crudPageFlags.isCloning = cloning;

        if (this.isNew) {
            const result = this.newModel(cloning && <TModel>this.model);
            return this.common.makePromise<TModel>(result).then(model => this.model = model);
        }

        return super.initModel({ id: this.$stateParams.id });
    }

    changeUrl(id:number|string) {
        return this.routing.go(this.routing.current().name, { id: id },
            { notify: false, reload: false });
    },

    initNewModel(cloning? :boolean) {
        //Id new olarak tekrar yukle
        this.changeUrl(NEW_ITEM_PARAM_NAME);
        //Yeni kayit
        this.isNew = true;
        //Clear notf
        !this.isModal && this.notification.removeAll();
        //Eger kopyalama yapılıyorsa tum degişiklikleri iptal et
        if (copying) {
            this.revertBack();
        }
        //Init
        return this.initialize(copying).then(function () {
            if (copying) {
                self.rtForm.$setDirty();
            }
        });
    },

    //updateModel(model: TModel): ng.IPromise<TModel> {
    //    //Call base and reset form
    //    return super.updateModel(model).then((model: TModel) => {
    //        //Eger edit modda kayit bulunamazsa !
    //        if (!this.isNew && model) {
    //            //Hata ver
    //            this.notification.error({ message: this.localization.getLocal("rota.modelbulunamadi")});
    //            //Yeni moda gec
    //            self.initNewModel();
    //            //Promise reject et ve cik
    //            return self.common.rejectedPromise();
    //        }
    //        //Set navigation buttons enabled/disabled
    //        self.scope.navEnabled = {
    //            next: !!self.getNavModel('next'),
    //            prev: !!self.getNavModel('prev')
    //        }
    //        //Model yuklendikten sonra modeli resetleyip yedekle revert icin
    //        self.resetForm(model);
    //        //Write model logs
    //        if (!self.isNew && !self.isModal) {
    //            self.writeSystemFields(model);
    //        }
    //        return model;
    //    });
    //},

    resetForm(model: TModel): void {
        this.isNew ? this.setModelAdded() : this.setModelUnChanged();
        this.rtForm.$setPristine();

        if (model) {
            this.orjModel = angular.copy(model);
        }
    }

    revertBack(): void {
        this.model = angular.extend(this.model, this.orjModel);
        this.resetForm(<TModel>this.model);
    }

    protected newModel(clonedModel?: TModel): ng.IPromise<TModel> | TModel {
        return this.common.promise({ id: 0 });
    }

    //#endregion


    /**
   * @abstract Get model
   * @param args Model
   */
    abstract getModel(): ng.IPromise<TModel> | TModel;


    abstract save(model: TModel): ng.IPromise<TModel>;
    abstract deleteById(id: number): ng.IPromise<any>;
}
//Export
export {BaseCrudController}