﻿//#region Imports
import {ILocalization} from '../services/localization.interface';
import {ICommon} from '../services/common.interface';
import {ILogger} from '../services/logger.interface';
import {IDialogs, IModalOptions} from '../services/dialogs.interface';
import {IBaseModel} from '../base/interfaces';
import {IBaseService} from '../services/service.interface';
//deps
import * as _ from "underscore";
import * as _s from "underscore.string";
import * as $ from 'jquery';

//#endregion

//#region Interfaces
/**
 * Select Model
 */
interface ISelectModel extends IBaseModel {
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
interface ISelectedEvent {
    (args: ISelectedEventArgs): void
}
/**
 * Data fetcher event interface
 */
interface ISelectDataMethod<T> {
    (...args: any[]): ng.IPromise<T> | T;
}

type ISelectItemsMethod = ISelectDataMethod<Array<ISelectModel>>;
type ISelectItemMethod = ISelectDataMethod<ISelectModel>;
/**
 * rtSelect attributes
 */
interface ISelectAttributes extends ng.IAttributes {
    /**
     * New item modal options
     */
    newItemOptions: string;
    /**
     * Search items modal options
     */
    searchOptions: string;
    /**
     * Propertyof model to be grouped by
     */
    groupbyProp: string;
    /**
     * Display property of model
     */
    displayProp: string;
    /**
     * Value property of model
     */
    valueProp: string;
    /**
     * Filter type
     */
    filterType: "startsWith" | "contains";
    /**
     * Refresh method name for autosuggest mode
     */
    refresh: string;
    /**
     * Items method name to get all items
     */
    items: string;
    /**
     * Select method name for setting model by selected key value
     */
    select: string;
    /**
     * Selectedchanged event name
     */
    onSelect: string;
    /**
     * ngDisabled
     */
    ngDisabled: any;
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
     * Service name inherits from IBaseService 
     */
    service: string;
    /**
     * Items method's optional parameters
     */
    params: any;
    /**
     * ngModel
     */
    ngModel: string;
    /**
     * Select data array name
     */
    data: string;
    /**
     * Custom class to be added container 
     */
    class: string;
}
/**
 * Select scope
 */
interface ISelectScope extends ng.IScope {
    /**
     * Items binded to ui-select
     */
    listItems: Array<ISelectModel>;
    /**
     * Selected model
     */
    selected: ISelection;
    /**
     * New Item modal options
     */
    showNewItemOptions: boolean;
    /**
     * Search items modal options
     */
    showSearchOptions: boolean;
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

        if (angular.isDefined(cAttrs.refresh)) {
            $choices.attr('refresh', "refreshFn($select.search)")
                .attr('refresh-delay', 0);
        } else {
            if (angular.isDefined(cAttrs.groupbyProp)) {
                $choices.attr('group-by', 'groupbyFn');
            }
        }
        //size & disabled
        $select.attr('ng-disabled', cAttrs.ngDisabled);
        //placeholder 
        $match.attr('placeholder', (cAttrs.placeholder || localization.getLocal(cAttrs.placeholderI18n || rtSelectConstants.defaultPlaceholderKey)))
            .html('<b ng-bind-html="$select.selected.' + displayProp + '"></b>');

        $choices.html('<div ng-bind-html="listItem.' + displayProp + '"></div>');
        //#endregion

        return (scope: ISelectScope, element: ng.IAugmentedJQuery, attrs: ISelectAttributes, modelCtrl: ng.INgModelController): void => {
            //#region Init attrs
            let asyncRequestingResult = common.promise<ISelectModel | Array<ISelectModel>>();
            const minAutoSuggestCharLen = attrs.minAutoSuggestCharLen || rtSelectConstants.minAutoSuggestCharLen;
            const autoSuggest = angular.isDefined(attrs.refresh);
            const service = attrs.service && $injector.get<IBaseService>(attrs.service);
            const refreshMethod = attrs.refresh;
            const selectMethod = attrs.select;
            const itemsMethod = attrs.items;
            const ngModel = modelCtrl;
            const params = $parse(attrs.params);
            let valuePropGetter = attrs.valueProp && $parse(attrs.valueProp);
            const newItemOptions: IModalOptions<ISelectModel> = attrs.newItemOptions && $parse(attrs.newItemOptions)(scope);
            const searchOptions: IModalOptions<ISelectModel> = attrs.searchOptions && $parse(attrs.searchOptions)(scope);
            //#endregion

            //#region Utility Methods
            /**
             * Trigger select index changed event
             * @param modelValue Selected model value
             * @param model Selected model
             */
            const callSelectedEvent = function (modelValue?: number, model?: ISelectModel): void {
                if (!common.isAssigned(attrs.onSelect)) return;

                const onSelect = $parse(attrs.onSelect);
                if (onSelect !== angular.noop) {
                    const onSelectEvent: ISelectedEvent = onSelect(scope);
                    if (onSelectEvent) {
                        onSelectEvent({ model: model, scope: scope, modelValue: modelValue });
                    }
                }
            }
            /**
             * Value mapper function
             * @param itemObject Content obj or object itself
             */
            const getValueMapper = function (itemObject: ISelectModel | number): number {
                return valuePropGetter ? valuePropGetter(itemObject) : itemObject;
            };
            /**
             * Get item by model value wrapped by promise
             * @param key Model Value
             */
            const findItemByKey = function (modelValue: number): ng.IPromise<ISelectModel> {
                return asyncRequestingResult.then((items: Array<ISelectModel>) => {
                    let foundItem: ISelectModel;
                    if (common.isArray(items)) {
                        for (let i = 0; i < items.length; i++) {
                            const itemValue = getValueMapper(items[i]);
                            if (itemValue === modelValue) {
                                foundItem = items[i];
                            }
                        }
                    }
                    return foundItem ? common.promise(foundItem) : common.rejectedPromise('not found');
                });
            }
            /**
             * Convert object to generic array
             * @param obj Object to convert
             */
            const convertObjToArray = function <T>(obj): Array<T> {
                const result = new Array<T>();
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        const item: T = <T>{};
                        item[rtSelectConstants.objValuePropName] = obj[prop];
                        item[rtSelectConstants.objDisplayPropName] = prop;
                        result.push(item);
                    }
                }
                return result;
            };
            /**
             * Call select directive methods,
             * @param funcName Function name to be called
             * @param args Optional function params
             */
            const callMethod = function <T>(funcName: string, ...args: any[]): ng.IPromise<T> {
                const d = $q.defer<T>();
                let methodResult: any;
                //check service method applied
                if (service && service[funcName]) {
                    const selectMethod: ISelectItemMethod | ISelectItemsMethod = service[funcName];
                    //call service method
                    methodResult = selectMethod.apply(service, args);
                } else {
                    //parse on scope 
                    const controllerObject = $parse(funcName)(scope);
                    //check func is function
                    if (common.isFunction(controllerObject)) {
                        //call scope method
                        methodResult = controllerObject.apply(scope, args);
                    } else {
                        //otherwise its supposed to be an array
                        methodResult = controllerObject;
                    }
                }
                common.makePromise<T>(methodResult).then(callMethodResult => {
                    d.resolve(callMethodResult);
                }, (reason) => {
                    d.reject(reason);
                });
                return d.promise;
            };
            /**
             * Get all items 
             * @param funcName AllItems method name
             */
            const bindAllItems = function (funcName: string): ng.IPromise<Array<ISelectModel>> {
                const args = params(scope);
                return asyncRequestingResult = callMethod<Array<ISelectModel> | ISelectModel>(funcName, args).then(
                    (data: Array<ISelectModel> | ISelectModel) => {
                        if (data && !common.isArray(data)) {
                            valuePropGetter = $parse(rtSelectConstants.objValuePropName);
                            data = convertObjToArray<ISelectModel>(data);
                        }
                        return scope.listItems = <Array<ISelectModel>>data;
                    });
            };
            //#endregion

            //#region Init
            /**
             * Assign "refreshFn" function to scope
             * @description This method is called when in autosuggest mode,more than "minAutoSuggestCharLen" chars is typed
             */
            const initAutoSuggest = function (): void {
                scope.refreshFn = (keyword: string): ng.IPromise<any> => {
                    if (keyword && minAutoSuggestCharLen <= keyword.length) {
                        const args = params(scope);
                        return asyncRequestingResult = callMethod<Array<ISelectModel>>(refreshMethod, keyword, args).then(
                            data => scope.listItems = data);
                    }
                    return undefined;
                };
            };
            /**
             * Get all data and bind in normal mode
             * @description itemsMethod will be used if auto-bind is demanded.Alternatively data attr should be used if array is used
             */
            const initAllItems = function (): void {
                if (common.isAssigned(itemsMethod)) {
                    if (common.isAssigned(attrs.params)) {
                        scope.$watch(attrs.params, () => {
                            bindAllItems(itemsMethod);
                        }, true);
                    } else {
                        bindAllItems(itemsMethod);
                    }
                } else
                    if (common.isDefined(attrs.data)) {
                        scope.$watch(attrs.data, (data: ISelectModel[]) => {
                            scope.listItems = data;
                        });
                    } else {
                        throw new Error("either items or data must be assigned for rtSelect");
                    }
            };
            /**
             * Initing select data
             */
            const init = function (): void {
                autoSuggest ? initAutoSuggest() : initAllItems();
            }
            //#endregion

            //#region Model Methods
            /**
             * Set model 
             * @param value Moel object
             */
            const setModel = function (value?: ISelectModel): void {
                scope.selected.model = value;
            };
            /**
             * Get Item by key value for autosuggest mode
             * @param key Model value
             */
            const getAutoSuggestItem = function (key: number): ng.IPromise<ISelectModel> {
                if (!common.isAssigned(selectMethod)) {
                    throw new Error("selectMethod must be assigned in autosuggest mode");
                }
                return callMethod(selectMethod, key).then((data: ISelectModel) => {
                    scope.listItems.unshift(data);
                    return data;
                });
            };
            /**
             * Update selected model by modelValue stemming from ngModel watch
             * @param modelValue Model value
             */
            const updateValueFromModel = function (modelValue: number): void {
                if (!common.isAssigned(modelValue)) {
                    return setModel();
                }
                //get item by key
                findItemByKey(modelValue).then((item) => {
                    setModel(item);
                }, () => {
                    if (autoSuggest) {
                        getAutoSuggestItem(modelValue).then((selItem: ISelectModel) => {
                            setModel(selItem);
                        });
                    }
                });
            };
            //#endregion

            //#region Init events & watchs
            /**
             * Watch model changes
             */
            scope.$watch(attrs.ngModel, function (modelValue: number) {
                updateValueFromModel(modelValue);
            });
            /**
             * Keyboad esc implementation to clear 
             */
            $(element).bind('keydown', function (e: JQueryEventObject) {
                if (e.which === rtSelectConstants.keyCodeToClearModel) {
                    scope.$apply(() => {
                        ngModel.$setViewValue(undefined);
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
            scope.onItemSelect = function (item: ISelectModel, model: ISelectModel): void {
                const modelValue = getValueMapper(item);
                ngModel.$setViewValue(modelValue);
                callSelectedEvent(modelValue, model);
            }
            //set options visibility
            scope.showNewItemOptions = common.isAssigned(newItemOptions);
            scope.showSearchOptions = common.isAssigned(searchOptions);
            //new item options
            if (scope.showNewItemOptions) {
                scope.runNewItem = $event => {
                    dialogs.showModal(newItemOptions).then((newItem: ISelectModel) => {
                        if (newItem) {
                            scope.listItems.unshift(newItem);
                            setModel(newItem);
                        }
                    });
                    $event.preventDefault();
                    $event.stopPropagation();
                };
            }
            //search options
            if (scope.showSearchOptions) {
                scope.searchItems = $event => {
                    dialogs.showModal(searchOptions).then((foundItem: ISelectModel) => {
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
                    $event.preventDefault();
                    $event.stopPropagation();
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
        restrict: 'AE',
        require: 'ngModel',
        replace: true,
        scope: true,
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
const selectDirectiveConstants = {
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
                '<div class="input-group col-md-12 col-sm-12 col-lg-12 col-xs-12"><ui-select name="{{name}}" ' +
                'style="width:100%" reset-search-input="true" ng-model="selected.model" ' +
                'on-select="onItemSelect($item, $model)" theme="select2">' +
                '<ui-select-match allow-clear="true"></ui-select-match>' +
                '<ui-select-choices></ui-select-choices></ui-select>' +
                '<a href ng-if="showNewItemOptions" ng-click="runNewItem($event)" class="input-group-addon"><i class="fa fa-ellipsis-h"></i></a>' +
                '<a href ng-if="showSearchOptions" ng-click="searchItems($event)" class="input-group-addon"><i class="fa fa-search"></i></a></div>');
        }
    ]);
//#endregion
