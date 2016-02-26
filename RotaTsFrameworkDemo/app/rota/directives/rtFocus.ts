//#region Interfaces
interface IFocusAttributes extends ng.IAttributes {
    rtFocus: any;
}
//#endregion

//#region Directive
function rtFocusDirective($timeout: ng.ITimeoutService) {
    function link($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IFocusAttributes): void {
        var focus = () => {
            $timeout(() => {
                const isInput = element[0] instanceof HTMLInputElement ||
                    element[0] instanceof HTMLButtonElement;
                if (isInput) {
                    element[0].focus();
                } else {
                    const input = element.find('input');
                    input && typeof input.focus == "function" && input.focus();
                }
            }, 0);
        };
        //lazy focus
        if (attrs.rtFocus) {
            $scope.$watch(attrs.rtFocus, newValue => {
                if (newValue === true) {
                    focus();
                }
            });
        } else {
            //initial focus
            focus();
        }
    }

    const directive = <ng.IDirective>{
        restrict: 'A',
        transclude: true,
        link: link
    };
    return directive;
}

rtFocusDirective.$inject = ['$timeout'];
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtfocus', []);
module.directive('rtFocus', rtFocusDirective);
//#endregion
