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
import {BaseCrudController} from './basecrudcontroller';
import * as _ from 'underscore';

//#endregion
abstract class CrudController<TModel extends IBaseCrudModel> extends BaseCrudController<TModel> {

    /**
   * Get if the page is in new state mode
   * @description Overriden baseformcontroller isNew property,Better way should be replaced when implemented for ES5
    * https://github.com/Microsoft/TypeScript/issues/338
   * @returns {boolean} 
   */
    get isNew(): boolean { return this.formPageFlags.isNew; }
    set isNew(value: boolean) {
        this.formPageFlags.isNew = value;
        this.editmodeBadge.show = !value;
        this.newmodeBadge.show = value;
    }
    //#region Badge Shortcuts
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
    * Copying badge
    * @returns {ITitleBadge}
    */
    get cloningBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Cloning]; }
    //#endregion

    //#region Bundle Services
    static injects = BaseCrudController.injects.concat(['TitleBadges']);
    protected titlebadges: ITitleBadges;
    //#endregion

    //#region Init
    constructor(bundle: IBundle, options?: ICrudPageOptions) {
        //call base constructor
        super(bundle, options);        
        //register catch changes
        this.registerEvent('$stateChangeStart',
            (event: ng.IAngularEvent, toState: IRotaState, toParams: ng.ui.IStateParamsService, fromState: IRotaState) => {
                if (toState.hierarchicalMenu && !toState.hierarchicalMenu.isNestedState &&
                    toState.name !== fromState.name &&
                    this.isFormDirty && this.isFormValid) {
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
    }
    /**
    * Update bundle
    * @param bundle IBundle
    */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);
        this.titlebadges = bundle.systemBundles["titlebadges"];
    }   
    //#endregion

    /**
    * Save Model 
    * @param options Save Options     
    */
    initSaveModel(options?: ISaveOptions): ng.IPromise<TModel> {
        const saveModelResult = super.initSaveModel(options);
        saveModelResult.finally(() => {
            if (this.crudPageFlags.isCloning)
                this.cloningBadge.show = false;           
        });
        return saveModelResult;
    }

    /**
    * Do some stuff after model loaded
    * @param model Model
    */
    loadedModel(model: TModel): void {
        super.loadedModel(model);       
        //set cloning warning & notify
        if (this.crudPageFlags.isCloning) {
            this.cloningBadge.show = true;
        }
    }

    //#region BaseFormController methods
    /**
     * Form invalid flag changes
     * @param invalidFlag Invalid flag of main form
     */
    onFormInvalidFlagChanged(invalidFlag: boolean): void {
        super.onFormInvalidFlagChanged(invalidFlag);
        this.invalidBadge.show = invalidFlag;
    }
    /**
     * Form dirty flag changes
     * @param dirtyFlag Dirty flag of main form
     */
    onFormDirtyFlagChanged(dirtyFlag: boolean): void {
        super.onFormDirtyFlagChanged(dirtyFlag);
        this.dirtyBadge.show = dirtyFlag;
    }
    //#endregion
}

export {CrudController}