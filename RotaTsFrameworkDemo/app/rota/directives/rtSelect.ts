//#region Imports
import {ILocalization} from '../services/localization.interface';
import {ICommon} from '../services/common.interface';
import {ILogger} from '../services/logger.interface';
import {IDialogs, IModalOptions} from '../services/dialogs.interface';
import {IBaseModel} from '../base/interfaces';
//deps
import * as _ from "underscore";
import * as _s from "underscore.string";
import * as $ from 'jquery';

//#endregion

//#region Interfaces
/**
 * Select Model
 */
export interface ISelectModel extends IBaseModel {
}
/**
 * Group Item Moedl
 */
export interface IGroupItemModel extends ISelectModel {
}
/**
 * Selection model interface for prototyping issues
 */
interface ISelection {
    model: ISelectModel
}
/**
 * Used Constants
 */
interface ISelectConstants {
    /**
     * When Enum object binded,its key value
     */
    objValuePropName: string;
    /**
     * When Enum object binded,its text value
     */
    objDisplayPropName: string;
    /**
     * Filter startsWith 
     */
    filterStartsWith: string;
    /**
     * Filter contains
     */
    filterContains: string;
    /**
     * Default placeholder
     */
    defaultPlaceholderKey: string;
    /**
     * Min autosuggest keyword length
     */
    minAutoSuggestCharLen: number;
    /**
     * Key code to clear model 
     */
    keyCodeToClearModel: number;
}
/**
 * Selected event args
 */
interface ISelectedEventArgs {
    modelValue?: number;
    model?: IBaseModel,
    scope: ISelectScope;
}
/**
 * Selected event
 */
interface ISelectedIndexChangedEvent {
    (args: ISelectedEventArgs): void
}
/**
 * Data fetcher event interface
 */
interface IItemsDataSourceMethod<T> {
    (...args: any[]): ng.IPromise<T> | T;
}
/**
 * Data Source objects 
 */
type IItemsDataSource<T> = T | ng.IPromise<T>;
type IDataSource<T> = IItemsDataSource<T> | IItemsDataSourceMethod<T>;
/**
 * rtSelect attributes
 */
export interface ISelectAttributes extends ng.IAttributes {
    autoSuggest: boolean;
    /**
     * Propertyof model to be grouped by
     */
    groupbyProp: string;
    /**
     * Display property name of model
     */
    displayProp: string;
    /**
     * Value property anme of model
     */
    valueProp: string;
    /**
     * Filter type
     */
    filterType: "startsWith" | "contains";
    /**
     * With of rtSelect default to 100%
     */
    width: string;
    /**
     * rtSelect Placeholder
     */
    placeholder: string;
    /**
     * rtSelect Placeholder i18n
     */
    placeholderI18n: string;
    /**
     * Min autosuggest keyboard length
     */
    minAutoSuggestCharLen: number;
    /**
     * Custom class to be added container 
     */
    class: string;
}
/**
 * Select scope
 */
interface ISelectScope extends ng.IScope {
    //#region Internal params
    /**
     * Items binded to ui-select
     */
    listItems: Array<ISelectModel>;
    /**
     * Selected model
     */
    selected: ISelection;
    /**
     * Group by function
     * @param model Model
     */
    groupbyFn: (model: ISelectModel) => any;
    /**
     * Refresh function to bind in autosuggest mode
     * @param keyword Keyword
     */
    refreshFn: (keyword: string) => ng.IPromise<Array<ISelectModel>> | Array<ISelectModel>;
    /**
     * Selected item changed event
     * @param item Model
     * @param model Model
     */
    onItemSelect: (item: ISelectModel, model: ISelectModel) => void;
    /**
     * Opens a new item modal window
     * @param event Event
     */
    runNewItem: (event: ng.IAngularEvent) => void;
    /**
     * Opens a search items modal window
     * @param event Event
     */
    searchItems: (event: ng.IAngularEvent) => void;
    //#endregion

    //#region External params 
    /**
     * SelectedIndex changed event 
     */
    selectedItemChanged: ISelectedIndexChangedEvent;
    /**
     * Triggered event after items get populated
     * @param model Items
     */
    dataSourceRetrived: (model: { items: Array<ISelectModel> }) => void;
    /**
     * New item modal options
     */
    newItemOptions: IModalOptions<ISelectModel>;
    /**
     * Search items model options
     */
    searchItemsOptions: IModalOptions<ISelectModel>;
    /**
     * Datasource object model
     */
    dataSourceObject: IItemsDataSource<Array<ISelectModel>>;
    /**
     * Method that returns datasource object
     */
    dataSourceMethod: IItemsDataSourceMethod<Array<ISelectModel>>;
    /**
     * In AutoSuggest mode,get select model by model value
     */
    getItemMethod: IItemsDataSourceMethod<ISelectModel>;
    /**
    * Items method's optional parameters
    */
    params: any;
    //#endregion
}

//#endregion

//#region Select Directive
function selectDirective($parse: ng.IParseService, $injector: ng.auto.IInjectorService,
    $q: ng.IQService, localization: ILocalization, common: ICommon, logger: ILogger, dialogs: IDialogs,
    rtSelectConstants: ISelectConstants) {

    function compile(cElement: ng.IAugmentedJQuery, cAttrs: ISelectAttributes) {
        //#region Dom manupulations
        const $select = $('ui-select', cElement),
            $choices = $('ui-select-choices', cElement),
            $match = $('ui-select-match', cElement);

        const displayProp = cAttrs.displayProp || rtSelectConstants.objDisplayPropName;
        const filterType = cAttrs.filterType || rtSelectConstants.filterContains;

        $choices.attr('repeat', 'listItem in listItems | rtSelectFilter:$select.search:\'' + displayProp + '\':\'' + filterType + '\'');

        if (angular.isDefined(cAttrs.autoSuggest)) {
            $choices.attr('refresh', "refreshFn($select.search)")
                .attr('refresh-delay', 0);
        } else {
            if (angular.isDefined(cAttrs.groupbyProp)) {
                $choices.attr('group-by', 'groupbyFn');
            }
        }
        //size & disabled
        //$select.attr('ng-disabled', cAttrs.ngDisabled);
        //placeholder 
        $match.attr('placeholder', (cAttrs.placeholder || localization.getLocal(cAttrs.placeholderI18n || rtSelectConstants.defaultPlaceholderKey)))
            .html('<b ng-bind-html="$select.selected.' + displayProp + '"></b>');

        $choices.html('<div ng-bind-html="listItem.' + displayProp + '"></div>');
        //#endregion

        return (scope: ISelectScope, element: ng.IAugmentedJQuery, attrs: ISelectAttributes, modelCtrl: ng.INgModelController): void => {
            //#region Init attrs
            /**
           * AutoSuggest flag
           */
            const autoSuggest = angular.isDefined(attrs.autoSuggest);
            /**
             * Listing defer obj
             * @description  Wait for the request to finish so that items would be available for ngModel changes to select
             */
            const asyncModelRequestResult = $q.defer<Array<ISelectModel>>();
            /**
             * * Min autosuggest keyboard length
             */
            const minAutoSuggestCharLen = attrs.minAutoSuggestCharLen || rtSelectConstants.minAutoSuggestCharLen;

            /**
             * Value property name of model 
             */
            let valuePropGetter = attrs.valueProp && $parse(attrs.valueProp);
            //#endregion

            //#region Validations
            //dataSourceObject
            //if (common.isDefined(scope.dataSourceObject) &&
            //    !common.isArray(scope.dataSourceObject) &&
            //    !common.isPromise(scope.dataSourceObject) &&
            //    !common.isString(scope.dataSourceObject)) {
            //    throw new Error("items must be array,promise or string");
            //}

            //if (autoSuggest) {
            //    if (!common.isDefined(refreshMethod)) {
            //        throw new Error("refreshMethod must be assigned in autosuggest mode");
            //    }
            //} else {
            //    //if (!common.isDefined(scope.dataSourceObject) && !common.isDefined(attrs.data)) {
            //    //    throw new Error("either items or data must be assigned");
            //    //}

            //    /*if (common.isAssigned(scope.dataSourceObject) ||
            //        common.isAssigned(scope.dataSourceMethod)) {*/
            //}
            //#endregion

            //#region Utility Methods
            /**
             * Trigger select index changed event
             * @param modelValue Selected model value
             * @param model Selected model
             */
            const callSelectedEvent = (modelValue?: number, model?: ISelectModel): void => {
                if (common.isAssigned(scope.selectedItemChanged)) {
                    scope.selectedItemChanged({ model: model, scope: scope, modelValue: modelValue });
                }
            }
            /**
             * Value mapper function
             * @param itemObject Content obj or object itself
             */
            const getValueMapper = (itemObject: ISelectModel): number => (valuePropGetter ? valuePropGetter(itemObject) : itemObject);
            /**
             * Get item by model value wrapped by promise
             * @param key Model Value
             */
            const findItemByKey = (modelValue: number): ng.IPromise<ISelectModel> => {
                const resultPromise = asyncModelRequestResult.promise;
                return resultPromise.then((items: Array<ISelectModel>) => {
                    let foundItem: ISelectModel;
                    if (common.isArray(items)) {
                        for (let i = 0; i < items.length; i++) {
                            const itemValue = getValueMapper(items[i]);
                            if (itemValue === modelValue) {
                                foundItem = items[i];
                                break;
                            }
                        }
                    }
                    return foundItem || common.rejectedPromise('not found by value ' + modelValue);
                });
            }
            /**
             * Call select directive methods,
             * @param funcName Function name to be called
             * @param args Optional function params
             */
            const callMethod = <T>(dataSource: IDataSource<T>, params: any): ng.IPromise<T> => {
                const d = $q.defer<T>();
                let methodResult: T | ng.IPromise<T>;
                //check func is function
                if (common.isFunction(dataSource)) {
                    const controllerMethod = <IItemsDataSourceMethod<T>>dataSource;
                    //call scope method
                    methodResult = controllerMethod(params);
                } else {
                    methodResult = <IItemsDataSource<T>>dataSource;
                }
                common.makePromise<T>(methodResult).then(callMethodResult => {
                    d.resolve(callMethodResult);
                }, (reason) => {
                    d.reject(reason);
                });
                return d.promise;
            };
            //#endregion

            //#region Model Methods
            /**
             * Set model 
             * @param value Moel object
             */
            const setModel = (value?: ISelectModel): void => {
                scope.selected.model = value;
            };
            /**
             * Set select data and resolve promise
             * @param items Items
             */
            const setItems = (items: ISelectModel[]): void => {
                if (!common.isArray(items)) return;

                asyncModelRequestResult.resolve(items);
                scope.listItems = items;
                //give out data to 'data' prop
                if (common.isDefined(scope.dataSourceRetrived)) {
                    scope.dataSourceRetrived({ items: items });
                }
            }
            /**
           * Get all items 
           * @param funcName AllItems method name
           */
            const bindAllItems = <T extends Array<ISelectModel>>(dataSource: IItemsDataSource<T> | IItemsDataSourceMethod<T>): void => {
                callMethod<T>(dataSource, { params: scope.params }).then(
                    (data: T) => {
                        //convert enum obj to array
                        if (data && !common.isArray(data)) {
                            valuePropGetter = $parse(rtSelectConstants.objValuePropName);
                            data = <T>common.convertObjToArray<ISelectModel>(data, rtSelectConstants.objValuePropName,
                                rtSelectConstants.objDisplayPropName);
                        }
                        setItems(data);
                    });
            };
            /**
             * Get Item by key value for autosuggest mode
             * @param key Model value
             */
            const getAutoSuggestItem = (key: number): ng.IPromise<ISelectModel> => {
                if (!common.isDefined(scope.getItemMethod)) {
                    throw new Error("selectMethod must be assigned in autosuggest mode");
                }
                return callMethod(scope.getItemMethod, { id: key }).then((data: ISelectModel) => {
                    if (data) {
                        setItems([data]);
                    }
                    return data;
                });
            };
            /**
             * Update selected model by modelValue stemming from ngModel watch
             * @param modelValue Model value
             */
            const updateValueFromModel = (modelValue: number): void => {
                if (!common.isAssigned(modelValue)) {
                    return setModel();
                }
                if (autoSuggest) {
                    getAutoSuggestItem(modelValue).then((selItem: ISelectModel) => {
                        setModel(selItem);
                    });
                } else {
                    //get item by key
                    findItemByKey(modelValue).then((item) => {
                        setModel(item);
                    });
                }
            };
            //#endregion

            //#region Init
            /**
             * Assign "refreshFn" function to scope
             * @description This method is called when in autosuggest mode,more than "minAutoSuggestCharLen" chars is typed
             */
            const initAutoSuggest = (): void => {
                scope.refreshFn = (keyword: string): ng.IPromise<Array<ISelectModel>> => {
                    if (keyword && minAutoSuggestCharLen <= keyword.length) {
                        return callMethod<Array<ISelectModel>>(scope.dataSourceObject || scope.dataSourceMethod,
                            { keyword: keyword }).then(
                            data => {
                                setItems(data);
                                return data;
                            });
                    }
                };
            };
            /**
             * Get all data and bind in normal mode
             * @description itemsMethod will be used if auto-bind is demanded.Watch triggers initally for first load
             */
            const initAllItems = (): void => {
                //watch params changes to rebind,fire for undefined first
                scope.$watch('params', (newValue: any) => {
                    bindAllItems<Array<ISelectModel>>(scope.dataSourceObject || scope.dataSourceMethod);
                }, true);
            };
            /**
             * Initing select data
             */
            const init = (): void => {
                autoSuggest ? initAutoSuggest() : initAllItems();
            }
            //#endregion

            //#region Init events & watchs
            /**
             * Inject formatter pipeline
             */
            modelCtrl.$formatters.push((modelValue: number) => {
                updateValueFromModel(modelValue);
                return modelValue;
            });
            /**
             * Keyboad esc implementation to clear 
             */
            $(element).bind('keydown', (e: JQueryEventObject) => {
                if (e.which === rtSelectConstants.keyCodeToClearModel) {
                    scope.$apply(() => {
                        modelCtrl.$setViewValue(undefined);
                        setModel();
                        callSelectedEvent();
                    });
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            //#endregion

            //#region Init scope
            scope.listItems = [];
            scope.selected = { model: null };
            //set groupBy function
            if (common.isAssigned(attrs.groupbyProp)) {
                scope.groupbyFn = item => item[attrs.groupbyProp];
            }
            /**
             * Selected index changed event  
             * @param item Model
             * @param model Model             
             */
            scope.onItemSelect = (item: ISelectModel, model: ISelectModel): void => {
                const modelValue = getValueMapper(item);
                modelCtrl.$setViewValue(modelValue);
                callSelectedEvent(modelValue, model);
            }
            //set options visibility
            //new item options
            if (scope.newItemOptions) {
                scope.runNewItem = $event => {
                    dialogs.showModal(scope.newItemOptions).then((newItem: ISelectModel) => {
                        if (newItem) {
                            scope.listItems.unshift(newItem);
                            setModel(newItem);
                        }
                    });
                    common.preventClick($event);
                };
            }
            //search options
            if (scope.searchItemsOptions) {
                scope.searchItems = $event => {
                    dialogs.showModal(scope.searchItemsOptions).then((foundItem: ISelectModel) => {
                        if (foundItem) {
                            const value = getValueMapper(foundItem);
                            if (autoSuggest) {
                                scope.listItems.unshift(foundItem);
                                setModel(foundItem);
                            } else {
                                updateValueFromModel(value);
                            }
                        }
                    });
                    common.preventClick($event);
                };
            }
            //#endregion

            init();
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
            dataSourceObject: '=?items',
            dataSourceMethod: '&?onFetch',
            dataSourceRetrived: '&?onRetrived',
            selectedItemChanged: '&?onChanged',
            getItemMethod: '&?onGet',
            params: '=?',
            newItemOptions: '=?',
            searchItemsOptions: '=?',
            ngDisabled: '=?'
        },
        templateUrl: 'rota/rtselect-options.tpl.html',
        compile: compile
    };
    return directive;
}
selectDirective.$inject = ['$parse', '$injector', '$q', 'Localization', 'Common', 'Logger', 'Dialogs', 'rtSelectConstants'];
//#endregion

//#region Select Filter
var selectFilter = ['Common', 'rtSelectConstants', function (common: ICommon, rtSelectConstants: ISelectConstants) {
    return function (list: ISelectModel[], keyword: string, displayProp: string, filterType: "startsWith" | "contains") {
        if (!keyword) return list;

        const searchValue = keyword.toLowerCase();
        let filteredList = list;
        //Check filter type
        switch (filterType) {
            case rtSelectConstants.filterStartsWith:
                filteredList = _.filter(list, item => {
                    var field = item[displayProp].toLowerCase(),
                        plainText = common.htmlToPlaintext(field);
                    return _s.startsWith(plainText, searchValue);
                });
                break;
            case rtSelectConstants.filterContains:
                filteredList = _.filter(list, item => {
                    var field = item[displayProp].toLowerCase(),
                        plainText = common.htmlToPlaintext(field);
                    return _s.include(plainText, searchValue);
                });
                break;
        }
        return filteredList;
    }
}];
//#endregion

//#region Select Constants
const selectDirectiveConstants: ISelectConstants = {
    objValuePropName: 'key',
    objDisplayPropName: 'value',
    filterStartsWith: 'startsWith',
    filterContains: 'contains',
    defaultPlaceholderKey: 'rota.seciniz',
    minAutoSuggestCharLen: 3,
    keyCodeToClearModel: 27
}
//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.directives.rtselect', []);
module.directive('rtSelect', selectDirective)
    .filter('rtSelectFilter', selectFilter)
    .constant('rtSelectConstants', selectDirectiveConstants)
    .run([
        '$templateCache', ($templateCache: ng.ITemplateCacheService) => {
            $templateCache.put('rota/rtselect-options.tpl.html',
                '<div class="input-group col-md-12 col-sm-12 col-lg-12 col-xs-12"><ui-select ng-disabled=ngDisabled name="{{name}}" ' +
                'style="width:100%" reset-search-input="true" ng-model="selected.model" ' +
                'on-select="onItemSelect($item, $model)" theme="select2">' +
                '<ui-select-match allow-clear="true"></ui-select-match>' +
                '<ui-select-choices></ui-select-choices></ui-select>' +
                '<a href ng-if="newItemOptions" ng-click="runNewItem($event)" class="input-group-addon"><i class="fa fa-ellipsis-h"></i></a>' +
                '<a href ng-if="searchItemsOptions" ng-click="searchItems($event)" class="input-group-addon"><i class="fa fa-search"></i></a></div>');
        }
    ]);
//#endregion
