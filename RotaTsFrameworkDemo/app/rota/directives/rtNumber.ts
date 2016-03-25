//#region Interfaces
interface INumberDirectiveAttrs extends ng.IAttributes {
    rtNumber: number;
}
//#endregion

//#region ngCurrency wrapper
function numberDirective($compile: ng.ICompileService) {

    function link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: INumberDirectiveAttrs): void {
        element.attr('fraction', attrs.rtNumber || 0);
        element.attr('ng-currency', '');
        element.attr('currency-symbol', '');
        //remove rtnumber to stop infinite loop
        element.removeAttr("rt-number");
        $compile(element)(scope);
    }

    //#region Directive Definition
    const directive = <ng.IDirective>{
        restrict: 'A',
        replace: false,
        terminal: true,
        priority: 1000,
        link: link
    };
    return directive;
    //#endregion
}
//#endregion

//#region Injections
numberDirective.$inject = ['$compile'];
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtnumber', []);
module.directive('rtNumber', numberDirective);
//#endregion
