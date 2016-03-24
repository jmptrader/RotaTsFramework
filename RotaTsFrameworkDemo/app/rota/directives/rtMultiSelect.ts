//#region Imports
import {ILocalization} from '../services/localization.interface';
import {ICommon} from '../services/common.interface';
import {ILogger, IAlertStyle} from '../services/logger.interface';
import {IDialogs, IModalOptions} from '../services/dialogs.interface';
import {IBaseModel, ModelStates, IBaseCrudModel} from '../base/interfaces';
import {IBaseService} from '../services/service.interface';
import {ISelectAttributes, ISelectScope, ISelectModel, IDataSource, IItemsDataSource,
    IItemsDataSourceMethod, ISelectedEventArgs} from './rtSelect.interface';
//deps
import * as _ from "underscore";
import * as _s from "underscore.string";
import * as $ from 'jquery';
//#endregion

//#region Interfaces
/**
 * Multi Select Model
 */
interface IMultiSelectListModel extends IBaseCrudModel {
}
/**
 * Group Item Model
 */
interface IGroupItemModel extends IMultiSelectListModel {
}
/**
 * Used Constants
 */
interface IMultiSelectConstants {
    /**
     * Default height
     */
    defaultHeight: number;
    /**
     * Delay value before notification label disappears
     */
    notificationDelay: number;
}
/**
 * Notififcation struct
 */
interface IMultiSelectNotification {
    /**
     * Notification message
     */
    message: string;
    /**
     * Notification Type
     */
    type: IAlertStyle;
}
/**
 * Localization structs
 */
interface IMultiSelectI18NService {
    kayitsayisi: string;
    kayitbulunamadi: string;
    tumunuekle: string;
    tumunusil: string;
    sil: string;
    kayitsilindi: string;
    kayiteklendi: string;
    zatenekli: string;
    onaytumkayitekle: string;
    onaytumkayitsil: string;
    tumkayitlarsilindi: string;
    tumkayitlareklendi: string;
}
/**
 * rtMultiSelect attributes
 */
interface IMultiSelectAttributes extends ISelectAttributes {
    /**
     * List height
     */
    height: number;
    /**
     * Value prop name of list model which equals to value-prop of select model
     */
    modelProp: string;
    /**
     * Radio selection model property name
     */
    selectionProp: string;
    /**
     * NgDisabled - Disabled state
     */
    ngDisabled: any;
    /**
     * Required flag
     */
    required: boolean;
}
/**
 * Multi Select scope
 */
interface IMultiSelectScope extends ISelectScope {
    /**
     * Autosuggest flag
     * @description declared refresh  method indicates that control will be autosuggest
     */
    autoSuggest: boolean;
    /**
     * Selected model {ISelectModel}
     */
    selectedModel: ISelectModel;
    /**
     * Control height
     */
    controlHeight: any;
    /**
     * Control body height
     */
    controlBodyHeight: any;
    //Localizations
    ttTumunuekle: string;
    ttTumunusil: string;
    ttSil: string;
    ttKayitbulunamadi: string;
    /**
     * Selection enabled flag
     */
    showSelection: boolean;
    /**
     * Visible items shown on the list
     */
    visibleItems: IMultiSelectListModel[];
    /**
     * Grouped items
     */
    groupItems: _.Dictionary<IMultiSelectListModel[]>;
    /**
     * Information label shown on footer
     */
    recordInfo: string;
    /**
     * Selection event when triggered radio button clicked
     * @param selItem Selection item
     * @param groupItems Grouped items if enabled
     */
    setSelected: (selItem: IMultiSelectListModel, groupItems: IGroupItemModel[]) => void;
    /**
     * Remove item
     * @param item Item to be removed 
     * @param event Angular event
     */
    removeItem: (item: IMultiSelectListModel, event: ng.IAngularEvent) => ng.IPromise<any>;
    /**
     * Add all items
     * @param event Angular event     
     */
    addAll: (event: ng.IAngularEvent) => ng.IPromise<any>;
    /**
     * Remove all items
     * @param event Angular event     
     */
    removeAll: (event: ng.IAngularEvent) => ng.IPromise<any>;
    /**
     * Triggered when select items get populated
     * @param items Select items     
     */
    onItemsPopulated: (items: Array<ISelectModel>) => void;
    /**
     * Triggered when selection changed
     * @param args Selection args     
     */
    onSelectionChanged: (args: ISelectedEventArgs) => void;
    /**
     * Notification object
     */
    notification: IMultiSelectNotification;
    /**
     * Triggered when an item has been removed
     * @param item Removed item
     */
    onRemoved: (item: IMultiSelectListModel) => void;
    /**
     * Triggered when an item is about to remove
     * @description Return rejected promise to stop removing process
     * @param item Removed item
     */
    onRemove: (item: IMultiSelectListModel) => ng.IPromise<any>;
    /**
     * Triggered when an item has been added
     * @param item Removed item
     */
    onAdded: (item: ISelectModel) => void;
    /**
     * Triggered when an item is about to add
     * @description Return rejected promise to stop adding process
     * @param item Added item
     */
    onAdd: (item: ISelectModel) => ng.IPromise<any>;
}
/**
 * Mapper obj
 */
interface IMapper<TContext, TTarget> {
    (context: TContext): TTarget;
}
//#endregion

//#region Multi Select Directive
function multiSelectDirective($timeout: ng.ITimeoutService, $parse: ng.IParseService, $injector: ng.auto.IInjectorService,
    $q: ng.IQService, common: ICommon, logger: ILogger, dialogs: IDialogs,
    rtMultiSelectConstants: IMultiSelectConstants, multiSelectI18NService: IMultiSelectI18NService) {

    function compile(cElement: ng.IAugmentedJQuery, cAttrs: IMultiSelectAttributes) {
        //#region DOM manupulations
        //#region rtSelect 
        const dropDown = $('rt-select', cElement);
        dropDown.attr('value-prop', cAttrs.valueProp)
            .attr('display-prop', cAttrs.displayProp)
            .attr('groupby-prop', cAttrs.groupbyProp)
            .attr('placeholder-i18n', cAttrs.placeholderI18n)
            .attr('placeholder', cAttrs.placeholder);

        if (common.isDefined(cAttrs.onRefresh)) {
            dropDown.attr('on-refresh', 'onRefresh({keyword:keyword})');
            dropDown.attr('on-get', 'onGet({id:id})');
        } else {
            dropDown.attr('items', 'items');
            dropDown.attr('on-fetch', 'onFetch({params:params})');
        }
        //#endregion

        const groupbyEnabled = common.isDefined(cAttrs.groupbyProp);
        const displayPropMarkup = '{{item' + (cAttrs.displayProp ? '.' + cAttrs.displayProp : '') + '}}';
        $('td.value', cElement).html(displayPropMarkup);
        //Selection Prop
        if (common.isDefined(cAttrs.selectionProp)) {
            const timestamp = new Date().getTime();
            //TODO:{{group}} icin slugify filter yazilabilir.!! Tehlikeli
            $('td.selection>input:radio', cElement).attr('name', (groupbyEnabled ? '{{group}}' + timestamp : timestamp))
                .attr('ng-model', 'item.' + cAttrs.selectionProp);
            //selection row highlight class
            $('tr.item', cElement).attr('ng-class', '{selected:item.' + cAttrs.selectionProp + '}');
        }
        //#endregion
        return (scope: IMultiSelectScope, element: ng.IAugmentedJQuery, attrs: IMultiSelectAttributes,
            modelCtrl: ng.INgModelController): void => {
            //#region Init Attrs
            /**
            * AutoSuggest flag
            */
            const autoSuggest = angular.isDefined(attrs.onRefresh);
            /**
             * Value prop getter function
             */
            const valuePropGetter = attrs.valueProp && $parse(attrs.valueProp);
            /**
             * Display prop getter function
             */
            const displayPropGetter = attrs.displayProp && $parse(attrs.displayProp);
            /**
             * Model value prop getter function
             */
            const modelValuePropGetter = attrs.modelProp && $parse(attrs.modelProp);
            /**
             * Group prop getter function
             */
            const groupbyPropGetter = attrs.groupbyProp && $parse(attrs.groupbyProp);
            /**
             * Selection (radio button) prop getter function
             */
            const selectionPropGetter = attrs.selectionProp && $parse(attrs.selectionProp);
            /**
             * Added items store 
             */
            const addedItems: IMultiSelectListModel[] = [];
            /**
             * Listing defer obj
             * @description  Wait for the request to finish so that items would be available for ngModel changes to select
             */
            const asyncModelRequestResult: ng.IDeferred<Array<ISelectModel>> = $q.defer();
            //#endregion

            //#region Validations
            if (!common.isAssigned(valuePropGetter)) {
                throw new Error('value prop must be defined');
            }
            if (!common.isAssigned(displayPropGetter)) {
                throw new Error('display prop must be defined');
            }
            if (!common.isAssigned(modelValuePropGetter)) {
                throw new Error('model prop must be defined');
            }
            //#endregion

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
            const getSelectValueMapper: IMapper<ISelectModel, number> = (context: ISelectModel): number => getMappedValue<ISelectModel, number>(context, valuePropGetter);
            const getSelectDisplayMapper: IMapper<ISelectModel, string> = (context: ISelectModel): string => getMappedValue<ISelectModel, string>(context, displayPropGetter);
            const getGroupbyMapper: IMapper<ISelectModel, any> = (context: ISelectModel): any => getMappedValue<ISelectModel, any>(context, groupbyPropGetter);
            const getModelValueMapper: IMapper<IMultiSelectListModel, number> = (context: IMultiSelectListModel) => getMappedValue<IMultiSelectListModel, number>(context, modelValuePropGetter);
            const getSelectionMapper: IMapper<ISelectModel, boolean> = (context: ISelectModel) => getMappedValue<ISelectModel, boolean>(context, selectionPropGetter);
            //#endregion

            //#region Utility
            /**
             *  Find list item by list item or value
             * @param value List item object or value
             */
            const findSelectItem = (value: IMultiSelectListModel): ng.IPromise<ISelectModel> => {
                const findValue = getModelValueMapper(value);
                return asyncModelRequestResult.promise.then((items: ISelectModel[]) => {
                    return _.find<ISelectModel>(items, (item): boolean => {
                        const modelValue = getSelectValueMapper(item);
                        return modelValue === findValue;
                    });
                });
            }
            /**
             * Find list item by list item or value
             * @param value List item object or value
             */
            const findListItem = (value: IMultiSelectListModel): IMultiSelectListModel => {
                const findValue = getModelValueMapper(value);
                return _.find<IMultiSelectListModel>(addedItems, (item): boolean => {
                    const modelValue = getModelValueMapper(item);
                    return modelValue === findValue;
                });
            }
            /**
             * Show multiSelect notification on footer
             * @param message Message
             * @param type Type
             */
            const showNotification = function (message: string, type: IAlertStyle = 'info') {
                scope.notification = {
                    message: message,
                    type: type
                };
                $timeout(() => {
                    scope.notification = null;
                }, rtMultiSelectConstants.notificationDelay);
            };
            //#endregion

            //#region Methods
            /**
             * Create new MultiSelectListModel
             * @param selectItem SelectItem
             * @param status Model Status  
             * @param existingModelItem Exisiting model to expand
             */
            const createMultiSelectModel = (selectItem: ISelectModel, status: ModelStates,
                existingModelItem?: IMultiSelectListModel): IMultiSelectListModel => {
                let listItem = common.newCrudModel(existingModelItem);
                listItem[attrs.modelProp] = getSelectValueMapper(selectItem);
                listItem[attrs.displayProp] = _s.trim(getSelectDisplayMapper(selectItem), '- ');
                if (scope.showSelection) {
                    listItem[attrs.selectionProp] = getSelectionMapper(selectItem);
                }
                if (groupbyEnabled) {
                    listItem[attrs.groupbyProp] = getGroupbyMapper(selectItem);
                }
                listItem = common.setModelState(listItem, status);

                return listItem;
            }
            /**
             * Update required validation
             */
            const updateValidation = () => {
                //Required settings
                const required = !scope.visibleItems.length && common.isDefined(attrs.required) && attrs.required;
                modelCtrl.$setValidity('required', !required);
            };
            /**
             * Add item to list
             * @param selectItem Select Item
             * @param modelStatus Model status for crud models
             * @param existingModelItem
             */
            const addItem = (selectItem: ISelectModel, modelStatus: ModelStates = ModelStates.Added,
                existingModelItem?: IMultiSelectListModel): ng.IPromise<any> => {
                if (!common.isAssigned(selectItem)) return common.rejectedPromise('item must be assigned');
                const defer = $q.defer<any>();
                const listItem = createMultiSelectModel(selectItem, modelStatus, existingModelItem);
                const existingListItem = findListItem(listItem);

                if (!common.isAssigned(existingListItem)) {
                    //call onadd method - 
                    const addResult = scope.onAdd(selectItem);
                    const addResultPromise = common.makePromise(addResult);
                    addResultPromise.then((): void => {
                        //add item to list
                        addedItems.unshift(listItem);
                        //call added event
                        scope.onAdded(selectItem);
                        //resolve defer
                        defer.resolve(listItem);
                    }, (reason: string): void => {
                        defer.reject(reason);
                    });
                } else {
                    if (existingListItem.modelState === ModelStates.Deleted) {
                        existingListItem.modelState = ModelStates.Unchanged;
                        //call added event
                        scope.onAdded(selectItem);
                        //resolve defer
                        defer.resolve(existingListItem);
                    } else {
                        defer.reject(multiSelectI18NService.zatenekli);
                    }
                }
                return defer.promise;
            }
            /**
             * Add all items to list
             */
            const addAll = (): ng.IPromise<any> => {
                return asyncModelRequestResult.promise.then((items: ISelectModel[]) => {
                    const itemPromises: ng.IPromise<any>[] = [];
                    items.forEach((item): void => {
                        itemPromises.push(addItem(item));
                    });
                    return $q.all(itemPromises);
                });
            }
            /**
             * Remove selected item
             * @param item Item to be removed
             */
            const removeItem = (item: IMultiSelectListModel): ng.IPromise<any> => {
                if (!common.isAssigned(item)) return common.rejectedPromise('item must be assigned');
                const removeResult = scope.onRemove(item);
                const removeResultPromise = common.makePromise(removeResult);

                return removeResultPromise.then(() => {
                    const index = addedItems.indexOf(item);
                    if (index === -1)
                        return common.rejectedPromise('no item found at index ' + index);

                    if (item.modelState === ModelStates.Added) {
                        addedItems.splice(index, 1);
                    } else {
                        item.modelState = ModelStates.Deleted;
                    }

                    updateModel();
                    scope.onRemoved(item);
                });
            }
            /**
             * Remove all items
             */
            const removeAll = (): ng.IPromise<any> => {
                const itemPromises: ng.IPromise<any>[] = [];
                addedItems.forEach((item): void => {
                    itemPromises.push(removeItem(item));
                });
                return $q.all(itemPromises);
            };

            //#endregion

            //#region Model Methods
            /**
             * Update ngModel
             */
            const updateModel = () => {
                //Set model
                modelCtrl.$setViewValue(addedItems);
                //Validation
                updateValidation();
            };
            /**
             * Update value according to ngModel
             * @param model
             */
            const updateValueFromModel = (model: any[]): void => {
                if (!common.isArray(model)) {
                    throw new Error('model must be array for rtMultiSelect');
                }
                const resultPromises: ng.IPromise<any>[] = [];
                if (!autoSuggest) {
                    model.forEach((item): void => {
                        const foundResultPromise = findSelectItem(item);
                        foundResultPromise.then((selectItem: ISelectModel): void => {
                            resultPromises.push(addItem(selectItem, ModelStates.Unchanged, <IMultiSelectListModel>item));
                        });
                    });
                } else {
                    model.forEach((item): void => {
                        const modelValue = getModelValueMapper(item);
                        const modelResultPromise = common.makePromise<IMultiSelectListModel>(scope.onGet({ id: modelValue }));
                        modelResultPromise.then((selectItem: ISelectModel): void => {
                            resultPromises.push(addItem(selectItem, ModelStates.Unchanged, item));
                        });
                    });
                }

                $q.all(resultPromises).finally((): void => {
                    updateValidation();
                });
            }
            /**
             * Inject ngModel formatter
             */
            modelCtrl.$formatters.push((model: any[]) => {
                if (!common.isAssigned(model)) return model;
                updateValueFromModel(model);
                return model;
            });
            //#endregion

            //#region Init scope
            /**
             * Auto suggest
             */
            scope.autoSuggest = autoSuggest;
            /**
             * MultiSelect height
             */
            scope.controlHeight = { height: attrs.height || multiSelectDirectiveConstants.defaultHeight };
            /**
             * MultiSelect list height
             */
            scope.controlBodyHeight = { height: (attrs.height || multiSelectDirectiveConstants.defaultHeight) - 60 };
            /**
            * Items thats is visible on the list
            */
            Object.defineProperty(scope, 'visibleItems', {
                configurable: false,
                get() {
                    return _.filter(addedItems, item => {
                        return item.modelState !== ModelStates.Deleted;
                    });
                }
            });
            /**
             * Watch items to obtain some info
             */
            scope.$watchCollection('visibleItems', (newValue: IMultiSelectListModel[]) => {
                if (common.isArray(newValue)) {
                    scope.recordInfo = newValue.length + ' ' + multiSelectI18NService.kayitsayisi;
                    if (groupbyEnabled) {
                        scope.groupItems = _.groupBy<IMultiSelectListModel>(newValue, attrs.groupbyProp);
                    }
                }
            });
            //#region Tooltips
            scope.ttTumunuekle = multiSelectI18NService.tumunuekle;
            scope.ttTumunusil = multiSelectI18NService.tumunusil;
            scope.ttSil = multiSelectI18NService.sil;
            scope.ttKayitbulunamadi = multiSelectI18NService.kayitbulunamadi;
            //#endregion
            /**
             * Remove item
             * @param item MultiSelectListItem
             * @param event Angular event
             */
            scope.removeItem = (item: IMultiSelectListModel, event: ng.IAngularEvent) => {
                common.preventClick(event);
                return removeItem(item).then(() => {
                    showNotification(multiSelectI18NService.kayitsilindi, 'danger');
                }, (message: string): void => {
                    showNotification(message, 'danger');
                    logger.toastr.error({ message: message });
                });
            };
            /**
             * Add all items 
             * @param event Angular event
             */
            scope.addAll = (event: ng.IAngularEvent): ng.IPromise<any> => {
                common.preventClick(event);
                return dialogs.showConfirm({ message: multiSelectI18NService.onaytumkayitekle }).then(() => {
                    return addAll().then((): void => {
                        showNotification(multiSelectI18NService.tumkayitlareklendi);
                    });
                });
            };
            /**
             * Remove all items
             * @param event Angular event
             */
            scope.removeAll = (event: ng.IAngularEvent): ng.IPromise<any> => {
                common.preventClick(event);
                return dialogs.showConfirm({ message: multiSelectI18NService.onaytumkayitsil }).then(() => {
                    return removeAll().then((): void => {
                        showNotification(multiSelectI18NService.tumkayitlarsilindi, 'danger');
                    });
                });
            };
            /**
             * rtSelect selected index changed event
             * @param args Selected index changed event args             
             */
            scope.onSelectionChanged = (args: ISelectedEventArgs): void => {
                if (!common.isAssigned(args.model)) return;

                addItem(args.model).then((): void => {
                    showNotification(multiSelectI18NService.kayiteklendi);
                },
                    (message: string): void => {
                        showNotification(message, 'danger');
                        logger.toastr.error({ message: message });
                    }).finally((): void => {
                        updateModel();
                        scope.selectedModel = null;
                    });
            }
            /**
             * Show selection radio
             */
            scope.showSelection = angular.isDefined(attrs.selectionProp);
            /**
             * Selection raido button click event
             * @param selItem Selected item
             * @param groupItems Grouped items if grouping enabled
             */
            scope.setSelected = (selItem: IMultiSelectListModel, groupItems?: IMultiSelectListModel[]) => {
                //uncheck all items
                (groupItems || addedItems).forEach((item: IMultiSelectListModel) => {
                    if (item[attrs.selectionProp] === true) {
                        item[attrs.selectionProp] = false;
                        item = common.setModelState(item, ModelStates.Modified);

                    }
                });
                //set selection
                selItem[attrs.selectionProp] = true;
                selItem = common.setModelState(selItem, ModelStates.Modified);
                updateModel();
            }

            /**
             * Event triggered since Select items gets populated
             * @description Defer object resolved here to wait for ngModel changes
             * @param items Select items
             */
            scope.onItemsPopulated = (items: Array<ISelectModel>): void => {
                asyncModelRequestResult.resolve(items);
            }
            //#endregion
        }
    }
    //#region Directive definition
    const directive = <ng.IDirective>{
        restrict: 'AE',
        require: 'ngModel',
        replace: true,
        scope: {
            //rtSelect options
            items: '=?',
            onFetch: '&?',
            onRefresh: '&?',
            onRetrived: '&?',
            onChange: '&?',
            onGet: '&?',
            params: '=?',
            newItemOptions: '=?',
            searchItemsOptions: '=?',
            ngDisabled: '=?',
            //rtMultiSelect options
            onRemoved: '&',
            onRemove: '&',
            onAdded: '&',
            onAdd: '&'
        },
        templateUrl: (elem: ng.IAugmentedJQuery, attr: IMultiSelectAttributes) => (common.isDefined(attr.groupbyProp) ?
            'rota/rtmultiselect.group.tpl.html' : 'rota/rtmultiselect.tpl.html'),
        compile: compile
    };
    return directive;
    //#endregion
}
//#region Injections
multiSelectDirective.$inject = ['$timeout', '$parse', '$injector', '$q', 'Common', 'Logger',
    'Dialogs', 'rtMultiSelectConstants', 'rtMultiSelectI18N'];
//#endregion
//#endregion

//#region MultiSelect Constants
const multiSelectDirectiveConstants: IMultiSelectConstants = {
    defaultHeight: 184,
    notificationDelay: 1500
}
//#endregion

//#region MultiSelect Localization Service
const multiSelectI18NService = [
    'Localization', (localization: ILocalization): IMultiSelectI18NService => {
        return {
            kayitsayisi: localization.getLocal("rota.kayitsayisi"),
            kayitbulunamadi: localization.getLocal("rota.kayitbulunamadi"),
            tumunuekle: localization.getLocal("rota.tumunuekle"),
            tumunusil: localization.getLocal("rota.tumunusil"),
            sil: localization.getLocal("rota.sil"),
            kayitsilindi: localization.getLocal('rota.kayitsilindi'),
            kayiteklendi: localization.getLocal('rota.kayiteklendi'),
            zatenekli: localization.getLocal('rota.zatenekli'),
            onaytumkayitekle: localization.getLocal('rota.onaytumkayitekle'),
            onaytumkayitsil: localization.getLocal('rota.onaytumkayitsil'),
            tumkayitlarsilindi: localization.getLocal('rota.tumkayitlarsilindi'),
            tumkayitlareklendi: localization.getLocal('rota.tumkayitlareklendi')
        };
    }
];

//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.directives.rtmultiselect', ['rota.directives.rtselect']);
module.factory('rtMultiSelectI18N', multiSelectI18NService)
    .constant('rtMultiSelectConstants', multiSelectDirectiveConstants)
    .directive('rtMultiSelect', multiSelectDirective)
    .run([
        '$templateCache', ($templateCache: ng.ITemplateCacheService) => {
            $templateCache.put('rota/rtmultiselect.tpl.html',
                '<div class="rt-multiselect" ng-style="controlHeight">' +
                '<div class="header"><rt-select ng-disabled=ngDisabled ng-model="selectedModel" on-retrived="onItemsPopulated(items)" on-change="onSelectionChanged(args)"></rt-select></div>' +
                '<div class="body" ng-style="controlBodyHeight"><table class="items">' +
                '<tr ng-if="visibleItems.length==0" class="empty-row"><td>' +
                '<label class="label label-default">{{::tt_kayitbulunamadi}}</label></td></tr>' +
                '<tr class="item" ng-repeat="item in visibleItems"><td class="selection" ng-if="showSelection">' +
                '<input type="radio" ng-value="true" ng-click="setSelected(item)"/></td><td class="value"></td>' +
                '<td align="right" class="text-align-center" style="width:10px">' +
                '<a class="command" ng-hide=ngDisabled href ng-click="removeItem(item,$event)" tooltip="{{::tt_sil}}" tooltip-placement="right">' +
                '<i class="fa fa-minus-circle text-danger"></i></a></td></tr></table></div>' +
                '<div class="footer"><span class="label alert-info"><i>{{recordInfo}}</i></span>' +
                '&nbsp;<span ng-if="notification" ng-class="\'alert-\' + notification.type" class="badge notification">' +
                '<i>{{notification.message}}</i></span>' +
                '<div class="pull-right">' +
                '<a class="command" ng-hide=ngDisabled href ng-if="!autoSuggest" ng-click="addAll($event)" tooltip="{{::tt_tumunuekle}}" tooltip-placement="top">' +
                '<i class="fa fa-plus-square text-info"></i></a>&nbsp;' +
                '<a class="command" ng-hide=ngDisabled href ng-click="removeAll($event)" tooltip="{{::tt_tumunusil}}" tooltip-placement="top">' +
                '<i class="fa fa-minus-square text-danger"></i></a></div>' +
                '<div class="clearfix"></div></div></div>');
            $templateCache.put('rota/rtmultiselect.group.tpl.html',
                '<div class="rt-multiselect" ng-style="controlHeight">' +
                '<div class="header"><rt-select ng-disabled=ngDisabled ng-model="selectedModel" on-retrived="onItemsPopulated(items)" on-change="onSelectionChanged(args)"></rt-select></div>' +
                '<div class="body" ng-style="controlBodyHeight"><table class="items">' +
                '<tr ng-if="visibleItems.length==0" class="empty-row"><td>' +
                '<label class="label label-default">{{::tt_kayitbulunamadi}}</label></td></tr>' +
                '<tr class="group-item" ng-repeat-start="(group,items) in groupItems"><td colspan="4">' +
                '<span class="badge alert-info">{{group}}</span></td></tr>' +
                '<tr ng-repeat-end class="item child-item" ng-repeat="item in items">' +
                '<td class="child-indent"></td><td class="selection" ng-if="showSelection">' +
                '<input type="radio" ng-value="true" ng-click="setSelected(item,items)"/></td><td class="value"></td>' +
                '<td align="right" class="text-align-center" style="width:10px">' +
                '<a class="command" href ng-click="removeItem(item,$event)" tooltip="{{::tt_sil}}" tooltip-placement="right">' +
                '<i class="fa fa-minus-circle text-danger"></i></a></td></tr></table></div>' +
                '<div class="footer"><span class="label alert-info"><i>{{recordInfo}}</i></span>' +
                '&nbsp;<span ng-if="notification" ng-class="\'alert-\' + notification.type" class="badge notification">' +
                '<i>{{notification.message}}</i></span>' +
                '<div class="pull-right">' +
                '<a class="command" href ng-if="!autoSuggest" ng-click="addAll($event)" tooltip="{{::tt_tumunuekle}}" tooltip-placement="top">' +
                '<i class="fa fa-plus-square text-info"></i></a>&nbsp;' +
                '<a class="command" href ng-click="removeAll($event)" tooltip="{{::tt_tumunusil}}" tooltip-placement="top">' +
                '<i class="fa fa-minus-square text-danger"></i></a></div>' +
                '<div class="clearfix"></div></div></div>');
        }
    ]);
//#endregion
