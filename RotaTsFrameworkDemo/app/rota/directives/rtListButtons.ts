//#region Directive
function listButtonsDirective() {
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
        '&nbsp;' +
        '<rt-button text-i18n="rota.temizle" icon="refresh" color="info" click="vm.clearGrid();vm.filter={};"></rt-button>&nbsp;' +
        '<rt-button text-i18n="rota.yenikayit" icon="plus" color="success" click="vm.goToDetailState()" shortcut="ctrl+ins"></rt-button>&nbsp;' +
        '<rt-button text-i18n="rota.secilikayitlarisil" icon="remove" color="danger" click="vm.initDeleteSelectedModels()" shortcut="ctrl+shift+del" ' +
        'ng-if="vm.gridSeletedRows.length"></rt-button>' +
        '</div>'
    };
    return directive;
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtlistbuttons', []);
module.directive('rtListButtons', listButtonsDirective);
//#endregion
