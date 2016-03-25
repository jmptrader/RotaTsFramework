//#region Interfaces
interface INumberDirectiveAttrs extends ng.IAttributes {
    rtNumber: number;
}
//#endregion

//#region ngCurrency wrapper
function numberDirective() {
    function compile(cElement: ng.IAugmentedJQuery, cAttrs: INumberDirectiveAttrs) {
        cAttrs.$set('fraction', cAttrs.rtNumber || 0);
        cAttrs.$set('ng-currency', '');
        cAttrs.$set('currency-symbol', '');
        return (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: INumberDirectiveAttrs): void => {
        }
    }
    //#region Directive Definition
    const directive = <ng.IDirective>{
        restrict: 'A',
        compile: compile
    };
    return directive;
    //#endregion
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtnumber', []);
module.directive('rtNumber', numberDirective);
//#endregion
