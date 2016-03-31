function formDirective() {
    const directive = <ng.IDirective>{
        replace: true,
        restrict: 'EA',
        transclude: true,
        template: '<form class="form-horizontal" name="vm.forms.rtForm" novalidate ng-init="vm.initFormScope(this)">' +
        '<ng-transclude></ng-transclude></form>'
    };
    return directive;
}

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtform', []);
module.directive('rtForm', formDirective);
//#endregion
