//#region Directive
function crudButtonsDirective() {
    const directive = <ng.IDirective>{
        restrict: 'E',
        replace: true,
        template:
        '<div>' +
        '<div class="btn-group">' +
        '<div class="btn-group">' +
        '<rt-button text-i18n="rota.yeni" icon="plus" color="info" click="vm.initNewModel()" ng-disabled="vm.isNew" ' +
        'shortcut="ctrl+ins"></rt-button>' +
        '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" ng-disabled="vm.isNew">' +
        '<span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a href i18n="rota.yenikopyala" ng-click="vm.initNewModel(true)"></a></li>' +
        '</ul></div>' +
        '</div>&nbsp;' +
        '<div class="btn-group" ng-if="!vm.isNew && (vm.navEnabled.prev || vm.navEnabled.next)">' +
        '<rt-button ng-disabled="!vm.navEnabled.prev" text-i18n="rota.oncekikayit" icon="arrow-circle-left " color="info" click="vm.initModelNav(0)" shortcut="shift+ctrl+left" ' +
        '></rt-button>' +
        '<rt-button ng-disabled="!vm.navEnabled.next" text-i18n="rota.sonrakikayit" icon="arrow-circle-right" color="info" click="vm.initModelNav(1)" shortcut="shift+ctrl+right" ' +
        ' icon-to-right></rt-button>' +
        '&nbsp;</div>' +
        '<div class="btn-group">' +
        '<rt-button text-i18n="rota.kaydet" icon="floppy-o" color="success" click="vm.initSaveModel()" disable-clickonce shortcut="ctrl+enter" ' +
        'ng-disabled="vm.rtForm.$invalid || vm.rtForm.$pending || vm.rtForm.$pristine"></rt-button>' +
        '<rt-button text-i18n="rota.kaydetdevam" icon="play" color="success" click="vm.initSaveContinue()" disable-clickonce shortcut="ctrl+shift+ins" ' +
        'ng-disabled="vm.rtForm.$invalid || vm.rtForm.$pending || vm.rtForm.$pristine"></rt-button>&nbsp;' +
        '</div>' +
        '<div class="btn-group">' +
        '<rt-button text-i18n="rota.gerial" icon="refresh" color="warning" click="vm.revertBack()" shortcut="shift+del" ' +
        'ng-disabled="vm.isNew || !vm.rtForm.$dirty"></rt-button>' +
        '<rt-button text-i18n="rota.sil" icon="remove" color="danger" click="vm.initDeleteModel()" shortcut="ctrl+del" ' +
        'ng-disabled="vm.isNew"></rt-button>' +
        '</div>' +
        '</div>'
    };
    return directive;
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtcrudbuttons', []);
module.directive('rtCrudButtons', crudButtonsDirective);
//#endregion
