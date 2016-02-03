//#region Imports
import * as spinner from "spinner";
//#endregion

//#region Interfaces
interface ISpinAttributes extends ng.IAttributes {
    spinnerOptionsName: string;
}

interface ISpinScope extends ng.IScope {
    rtSpinner: Spinner;
}
//#endregion

//#region Directive
function menuDirective() {
    function link(scope: ISpinScope, element: ng.IAugmentedJQuery, attrs: ISpinAttributes): void {
        scope.$watch(attrs.spinnerOptionsName, options => {
            if (scope.rtSpinner) {
                scope.rtSpinner.stop();
            }
            scope.rtSpinner = new spinner(options);
            scope.rtSpinner.spin(element[0]);
        }, true);
    }

    const directive = <ng.IDirective>{
        restrict: 'A',
        link: link
    };
    return directive;
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtspinner', []);
module.directive('rtSpinner', menuDirective);
//#endregion
