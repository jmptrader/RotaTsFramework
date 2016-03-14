//#region Imports
import {ILocalization} from '../services/localization.interface';
import {ICommon} from '../services/common.interface';
import {ILogger, IAlertStyle} from '../services/logger.interface';
import {IDialogs, IModalOptions} from '../services/dialogs.interface';
import {IBaseModel, ModelStates, IBaseCrudModel} from '../base/interfaces';
import {IBaseService} from '../services/service.interface';
import {ISelectAttributes, ISelectScope, ISelectModel, IDataSource, IItemsDataSource,
    IItemsDataSourceMethod, IGroupItemModel, ISelectedIndexChangedEvent, ISelectedEventArgs} from './rtSelect';
//deps
import * as _ from "underscore";
import * as _s from "underscore.string";
import * as $ from 'jquery';

//#endregion

//#region Interfaces
interface IMultiSelectModel extends IBaseModel {
}

/**
 * Used Constants
 */
interface IMultiSelectConstants {
    defaultHeight: number;
    notificationDelay: number;
}

interface IMultiSelectNotification {
    message: string;
    type: IAlertStyle;
}

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
    height: number;

}
/**
 * Multi Select scope
 */
interface IMultiSelectScope extends ISelectScope {
    autoSuggest: boolean;
    controlHeight: any;
    controlBodyHeight: any;
    ttTumunuekle: string;
    ttTumunusil: string;
    ttSil: string;
    ttKayitbulunamadi: string;


    notification: IMultiSelectNotification;

    onSelected: ISelectedIndexChangedEvent;
    onRemoved: (item: IMultiSelectModel) => void;
    onRemove: (item: IMultiSelectModel) => ng.IPromise<any>;
    onAdded: (item: IMultiSelectModel) => void;
    onAdd: (item: IMultiSelectModel) => ng.IPromise<any>;
}

//#endregion

//#region Multi Select Directive
function multiSelectDirective($timeout: ng.ITimeoutService, $parse: ng.IParseService, $injector: ng.auto.IInjectorService,
    $q: ng.IQService, common: ICommon, logger: ILogger, dialogs: IDialogs,
    rtMultiSelectConstants: IMultiSelectConstants, multiSelectI18NService: IMultiSelectI18NService) {

    function compile(cElement: ng.IAugmentedJQuery, cAttrs: IMultiSelectAttributes) {
        //#region DOM manupulations
        const dropDown = $('rt-select', cElement);
        dropDown.attr('value-prop', cAttrs.valueProp)
            .attr('display-prop', cAttrs.displayProp)
            .attr('placeholder-i18n', cAttrs.placeholderI18n)
            .attr('placeholder', cAttrs.placeholder);
        //set command buttons hide depends on ng-disabled
        //$('a.command', cElement).attr('ng-hide', cAttrs.ngDisabled);
        //groupby enabled
        const groupbyEnabled = common.isDefined(cAttrs.groupbyProp);
        //row template
        var displayPropMarkup = '{{item' + (cAttrs.displayProp ? '.' + cAttrs.displayProp : '') + '}}';
        $('td.value', cElement).html(displayPropMarkup);
        //Selection Prop
        //if (common.isDefined(cAttrs.selectionProp)) {
        //    var timestamp = new Date().getTime();
        //    //TODO:{{group}} icin slugify filter yazilabilir.!! Tehlikeli
        //    $('td.selection>input:radio', cElement).attr('name', (groupbyEnabled ? '{{group}}' + timestamp : timestamp))
        //        .attr('ng-model', 'item.' + cAttrs.selectionProp);
        //    //selection row highlight class
        //    $('tr.item', cElement).attr('ng-class', '{selected:item.' + cAttrs.selectionProp + '}');
        //}
        //#endregion

        return (scope: IMultiSelectScope, element: ng.IAugmentedJQuery, attrs: IMultiSelectAttributes, modelCtrl: ng.INgModelController): void => {
            //#region Init Attrs
            /**
           * AutoSuggest flag
           */
            const autoSuggest = angular.isDefined(attrs.autoSuggest);
            const valuePropGetter = $parse(attrs.valueProp);
            const displayPropGetter = $parse(attrs.displayProp);
            const groupbyPropGetter = attrs.groupbyProp && $parse(attrs.groupbyProp);
            /**
             * Added items store
             */
            const addedItems = [];
            //#endregion


            //#region Init scope
            scope.autoSuggest = autoSuggest;
            scope.controlHeight = { height: attrs.height || multiSelectDirectiveConstants.defaultHeight };
            scope.controlBodyHeight = { height: (attrs.height || multiSelectDirectiveConstants.defaultHeight) - 60 };

            //#region Tooltips
            scope.ttTumunuekle = multiSelectI18NService.tumunuekle;
            scope.ttTumunusil = multiSelectI18NService.tumunusil;
            scope.ttSil = multiSelectI18NService.sil;
            scope.ttKayitbulunamadi = multiSelectI18NService.kayitbulunamadi;
            //#endregion

            scope.onChange = (args: ISelectedEventArgs): void => {
                debugger;
            }



            //#endregion

            //#region Mappers
            const getValueMapper = (itemObject: ISelectModel): number => ((valuePropGetter && angular.isObject(itemObject)) ? valuePropGetter(itemObject) : itemObject);
            //Eger value prop tanımlşanmişsa valueyu yoksa tum objeyi
            var getDisplayMapper = (itemObject: ISelectModel): string => displayPropGetter(itemObject);
            //Eger selection prop tanımlşanmişsa valueyu yoksa tum objeyi
            var getGroupbyMapper = (itemObject: IGroupItemModel): IGroupItemModel => (groupbyPropGetter ? groupbyPropGetter(itemObject) : itemObject);
            //#endregion

            //#region Utility
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
            /**
             * Show multiSelect notification on footer
             * @param message Message
             * @param type Type
             */
            const showNotification = function (message: string, type: IAlertStyle) {
                scope.notification = {
                    message: message,
                    type: type
                };
                $timeout(() => {
                    scope.notification = null;
                }, rtMultiSelectConstants.notificationDelay);
            };

            //const toMultiSelectModel = function (selectItem:ISelectModel, modelItem, status) {
            //    if (!selectItem) {
            //        throw new Error('selectitem must not be null');
            //    }

            //    var listItem = {};
            //    listItem[attrs.modelValueProp] = getValueMapper(selectItem);
            //    listItem[attrs.displayProp] = _s.trim(getDisplayMapper(selectItem), '- ');
            //    listItem = common.setModelState(listItem, status || MODEL_STATES.UNCHANGED)

            //    if (scope.showSelection) {
            //        listItem[attrs.selectionProp] = getSelectionMapper(modelItem);
            //    }

            //    if (groupbyEnabled) {
            //        listItem[attrs.groupbyProp] = getGroupbyMapper(selectItem);
            //    }
            //    //Return new obj
            //    return angular.extend({}, modelItem, listItem);
            //}

            //#endregion

        }
    }

    /**
     * Directive definition
     */
    const directive = <ng.IDirective>{
        restrict: 'AE',
        require: 'ngModel',
        replace: true,
        scope: {
            //rtSelect options
            items: '=?',
            onFetch: '&?',
            onRetrived: '&?',
            onChange: '&?',
            onGet: '&?',
            params: '=?',
            newItemOptions: '=?',
            searchItemsOptions: '=?',
            ngDisabled: '=?',
            //rtMultiSelect options
            onRemoved: '&?',
            onRemove: '&?',
            onAdded: '&?',
            onAdd: '&?'
        },
        templateUrl: (elem: ng.IAugmentedJQuery, attr: IMultiSelectAttributes) => (common.isDefined(attr.groupbyProp) ?
            'rota/rtmultiselect.group.tpl.html' : 'rota/rtmultiselect.tpl.html'),
        compile: compile
    };
    return directive;
}
multiSelectDirective.$inject = ['$timeout', '$parse', '$injector', '$q', 'Common', 'Logger',
    'Dialogs', 'rtMultiSelectConstants', 'rtMultiSelectI18N'];
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
                '<div class="header"><rt-select ng-model="model.item" on-change="onChange(args)" on-fetch="onFetch" items="items"></rt-select></div>' +
                '<div class="body" ng-style="controlBodyHeight"><table class="items">' +
                '<tr ng-if="visibleItems.length==0" class="empty-row"><td>' +
                '<label class="label label-default">{{::tt_kayitbulunamadi}}</label></td></tr>' +
                '<tr class="item" ng-repeat="item in visibleItems"><td class="selection" ng-if="showSelection">' +
                '<input type="radio" ng-value="true" ng-click="setSelected(item)"/></td><td class="value"></td>' +
                '<td align="right" class="text-align-center" style="width:10px">' +
                '<a class="command" href ng-click="removeItem(item,$event)" tooltip="{{::tt_sil}}" tooltip-placement="right">' +
                '<i class="fa fa-minus-circle text-danger"></i></a></td></tr></table></div>' +
                '<div class="footer"><span class="label alert-info"><i>{{recordInfo}}</i></span>' +
                '&nbsp;<span ng-if="notification" ng-class="\'alert-\' + notification.type" class="badge notification">' +
                '<i>{{notification.msg}}</i></span>' +
                '<div class="pull-right">' +
                '<a class="command" href ng-if="!autoSuggest" ng-click="addAll($event)" tooltip="{{::tt_tumunuekle}}" tooltip-placement="top">' +
                '<i class="fa fa-plus-square text-info"></i></a>&nbsp;' +
                '<a class="command" href ng-click="removeAll($event)" tooltip="{{::tt_tumunusil}}" tooltip-placement="top">' +
                '<i class="fa fa-minus-square text-danger"></i></a></div>' +
                '<div class="clearfix"></div></div></div>');
            $templateCache.put('rota/rtmultiselect.group.tpl.html',
                '<div class="rt-multiselect" ng-style="controlHeight">' +
                '<div class="header"><rt-select ng-model="model.item" on-change="onChange(args)" on-fetch="onFetch" items="items"></rt-select></div>' +
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
                '<i>{{notification.msg}}</i></span>' +
                '<div class="pull-right">' +
                '<a class="command" href ng-if="!autoSuggest" ng-click="addAll($event)" tooltip="{{::tt_tumunuekle}}" tooltip-placement="top">' +
                '<i class="fa fa-plus-square text-info"></i></a>&nbsp;' +
                '<a class="command" href ng-click="removeAll($event)" tooltip="{{::tt_tumunusil}}" tooltip-placement="top">' +
                '<i class="fa fa-minus-square text-danger"></i></a></div>' +
                '<div class="clearfix"></div></div></div>');
        }
    ]);
//#endregion
