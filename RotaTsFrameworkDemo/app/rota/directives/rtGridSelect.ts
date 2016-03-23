//#region Imports
import {ILocalization} from '../services/localization.interface';
import {ICommon} from '../services/common.interface';
import {ILogger} from '../services/logger.interface';
import {IDialogs, IModalOptions} from '../services/dialogs.interface';
import {IBaseModel, IGridOptions, ModelStates, IBaseCrudModel} from '../base/interfaces';
//deps
import * as _ from "underscore";
import * as _s from "underscore.string";
import * as $ from 'jquery';

//#endregion

//#region Interfaces
interface IGridSelectModel extends IBaseCrudModel {

}
/**
 * rtGridSelect attributes
 */
interface IGridSelectAttributes extends ng.IAttributes {
    /**
    * Required flag
    */
    required: boolean;
    /**
    * Value prop name of list model which equals to value-prop of select model
    */
    valueProp: string;
}
/**
 * GridSelect scope
 */
interface IGridSelectScope extends ng.IScope {
    /**
   * Visible items shown on the list
   */
    visibleItems: IGridSelectModel[];
    options: IGridSelectOptions<IGridSelectModel>;
    addNewItem: (model?: IGridSelectModel) => ng.IPromise<any>;
    removeItem: (model: IGridSelectModel, event: ng.IAngularEvent) => void;
    /**
   * Items method's optional parameters
   */
    params: any;
}

export interface IGridSelectOptions<T> extends IGridOptions {
    newItemOptions?: IModalOptions<T>;
}
/**
 * Mapper obj
 */
interface IMapper<TContext, TTarget> {
    (context: TContext): TTarget;
}
//#endregion


//#region GridSelect Directive
function gridSelectDirective($parse: ng.IParseService, dialogs: IDialogs, common: ICommon, logger: ILogger, localization: ILocalization) {

    function link(scope: IGridSelectScope, element: ng.IAugmentedJQuery,
        attrs: IGridSelectAttributes, modelCtrl: ng.INgModelController): void {
        /**
         * Added items store 
         */
        let addedItems: IGridSelectModel[] = [];
        /**
        * Model value prop getter function
        */
        const valuePropGetter = attrs.valueProp && $parse(attrs.valueProp);

        const initGrid = (): void => {
            scope.options.enablePaginationControls =
                scope.options.enablePagination = false;
            scope.options.enableHorizontalScrollbar = 0;

            const buttons: uiGrid.IColumnDef[] = [];
            const getButtonColumn = (name: string, template: string): any => {
                return {
                    name: name,
                    cellClass: 'col-align-center',
                    width: '30',
                    displayName: '',
                    enableColumnMenu: false,
                    cellTemplate: template
                };
            }
            //edit button
            if (scope.options.showEditButton) {
                const editbutton = getButtonColumn('edit-button',
                    '<a class="btn btn-default btn-xs" ng-click="grid.appScope.addNewItem(row.entity)"' +
                    ' uib-tooltip=\'Detay\' tooltip-placement="top"><i class="glyphicon glyphicon-edit"></i></a>');
                buttons.push(editbutton);
            }
            //delete button
            if (scope.options.showDeleteButton) {
                const editbutton = getButtonColumn('delete-button', '<a class="btn btn-default btn-xs" ' +
                    'ng-click="grid.appScope.removeItem(row.entity,$event)" uib-tooltip=\'Sil\'' +
                    'tooltip-placement="top"><i class="glyphicon glyphicon-trash text-danger"></i></a>');
                buttons.push(editbutton);
            }
            scope.options.columnDefs = scope.options.columnDefs.concat(buttons);
        }

        initGrid();
        //#region Mappers
        /**
         * Base mapper function
         * @param context Context obj
         * @param parser Parser method
         */
        const getMappedValue = <TContext extends IBaseModel, TTarget>(context: TContext, parser?: ng.ICompiledExpression): TTarget => {
            if (parser && angular.isObject(context)) {
                return <TTarget>parser(context);
            }
            return undefined;
        }
        const getModelValueMapper: IMapper<IGridSelectModel, number> = (context: IGridSelectModel) => getMappedValue<IGridSelectModel, number>(context, valuePropGetter);
        //#endregion
        /**
       * Find list item by list item or value
       * @param value List item object or value
       */
        const findListItem = (value: IGridSelectModel): IGridSelectModel => {
            const findValue = getModelValueMapper(value);
            return _.find<IGridSelectModel>(addedItems, (item): boolean => {
                const modelValue = getModelValueMapper(item);
                return modelValue === findValue;
            });
        }

        const updateGrid = () => {
            const rows = _.filter(addedItems, item => {
                return item.modelState !== ModelStates.Deleted;
            });
            scope.options.data = rows;
        }

        const updateModel = () => {
            //Set model
            modelCtrl.$setViewValue(addedItems);
            modelCtrl.$setDirty();

            //if (!scope.visibleItems.length && common.isDefined(attrs.required) && attrs.required) {
            //    modelCtrl.$setValidity('required', false);
            //}
        };


        scope.removeItem = (model: IGridSelectModel, event: ng.IAngularEvent) => {
            common.preventClick(event);
            if (model.modelState === ModelStates.Added) {
                const index = addedItems.indexOf(model);
                addedItems.splice(index, 1);
            } else {
                common.setModelState(model, ModelStates.Deleted);
            }
            updateModel();
        }



        modelCtrl.$formatters.push(val => {
            addedItems = val;
            updateGrid();
            return val;
        });

        scope.addNewItem = (model: IGridSelectModel): ng.IPromise<any> => {
            //get modal options expanded model param
            const modalOptions = common.extend<IModalOptions<IGridSelectModel>>
                (scope.options.newItemOptions, {
                    instanceOptions: {
                        model: model || common.newCrudModel(),
                        params: { items: addedItems, params: scope.params }
                    }
                });
            //show modal 
            return dialogs.showModal<IGridSelectModel, IGridSelectModel>(modalOptions).then((modalResult): void => {
                //find list item by model value prop
                const existingListItem = findListItem(modalResult);
                //new record
                if (!common.isAssigned(existingListItem)) {
                    if (modalResult.modelState === ModelStates.Added) {
                        addedItems.unshift(modalResult);
                    } else {
                        throw new Error("model state should be in \'Added\' state");
                    }
                } else {
                    //editing
                    switch (existingListItem.modelState) {
                        case ModelStates.Added:
                            logger.toastr.error({ message: localization.getLocal('rota.zatenekli') });
                            break;
                        case ModelStates.Deleted:
                            existingListItem.modelState = ModelStates.Modified;
                            common.merge(existingListItem, modalResult);
                            break;
                        case ModelStates.Detached:
                        case ModelStates.Unchanged:
                        case ModelStates.Modified:
                            break;
                    }
                }
                updateModel();
                updateGrid();
            });
        }
    }

    /**
         * Directive definition
         */
    const directive = <ng.IDirective>{
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        scope: {
            options: '=?',
            params: '=?'
        },
        template: '<div class="rt-grid-select">' +
        '<rt-grid grid-options="options" grid-feature-list="no-feature"></rt-grid>' +
        '<div class="footer">' +
        '<rt-button class="new-button" text="Yeni kayit" ' +
        'icon="plus" size="xs" color="primary" click="addNewItem()"></rt-button><div class="clearfix"></div>' +
        '</div></div>',
        link: link
    };
    return directive;
}
gridSelectDirective.$inject = ['$parse', 'Dialogs', 'Common', 'Logger', 'Localization'];
//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.directives.rtgridselect', []);
module.directive('rtGridSelect', gridSelectDirective);

//#endregion
