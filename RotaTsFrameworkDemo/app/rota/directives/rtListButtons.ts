//#region Imports
import {ILocalization} from '../services/localization.interface';
import {IListPageOptions} from "../base/interfaces";
//deps
import "../filters/rtI18n";
//#endregion

//#region Interfaces
/**
 * Inherit from BaseListController scope
 */
interface IListButtonsScope extends ng.IScope {
    listPageOptions: IListPageOptions;
    goToDetailState(state?: string): void;
}
//#endregion

//#region Directive
listButtonsDirective.$inject = ['hotkeys', 'Localization'];
function listButtonsDirective(hotkeys: ng.hotkeys.HotkeysProvider, localization: ILocalization) {
    const newRecordText = localization.getLocal('rota.yenikayit');
    function link(scope: IListButtonsScope, element: ng.IAugmentedJQuery): void {
        if (scope.listPageOptions.editState) {
            hotkeys.bindTo(scope).add({
                combo: 'ctrl+ins',
                description: newRecordText,
                allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
                callback: () => {
                    scope.goToDetailState();
                }
            });
        }
    }

    const directive = <ng.IDirective>{
        restrict: 'E',
        replace: true,
        template:
        '<div>' +
        '<rt-button text-i18n="rota.ara" icon="search" ng-disabled="vm.rtForm.$invalid" color="warning" click="vm.initSearchModel()" shortcut="ctrl+enter"></rt-button>&nbsp;' +
        '<div class="btn-group">' +
        '<button type="button" class="btn btn-info" ng-click="vm.exportGrid(\'visible\',\'pdfExport\')" i18n="rota.disariyaaktar"></button>' +
        '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">' +
        '<span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a href i18n="rota.aktarallcsv" ng-click="vm.exportGrid(\'all\',\'csvExport\')"></a></li>' +
        '<li><a href i18n="rota.aktarekrandakicsv" ng-click="vm.exportGrid(\'visible\',\'csvExport\')"></a></li>' +
        '<li><a href i18n="rota.aktarsecilicsv" ng-disabled="vm.gridSeletedRows.length" ng-click="vm.exportGrid(\'selected\',\'csvExport\')"></a></li>' +
        '<li role="separator" class="divider"></li>' +
        '<li><a href i18n="rota.aktarallpdf" ng-click="vm.exportGrid(\'all\',\'pdfExport\')"></a></li>' +
        '<li><a href i18n="rota.aktarekrandakipdf" ng-click="vm.exportGrid(\'visible\',\'pdfExport\')"></a></li>' +
        '<li><a href i18n="rota.aktarsecilipdf" ng-disabled="vm.gridSeletedRows.length" ng-click="vm.exportGrid(\'selected\',\'pdfExport\')"></a></li>' +
        '</ul></div>' +
        '&nbsp;<a class="btn btn-info" ' +
        'ng-click="vm.clearGrid();vm.filter={};"><i class="fa fa-refresh"></i>&nbsp;<span class="hidden-sm hidden-xs">{{::"rota.temizle" | i18n}}</span></a>&nbsp;' +
        '<a href class="btn btn-success" ng-if="vm.listPageOptions.editState" ng-click="vm.goToDetailState()"><i class="fa fa-plus"></i>&nbsp;<span class="hidden-sm hidden-xs">{{::"rota.yenikayit" | i18n}}</span></a>' +
        '</div>',
        link: link
    };
    return directive;
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtlistbuttons', []);
module.directive('rtListButtons', listButtonsDirective);
//#endregion
