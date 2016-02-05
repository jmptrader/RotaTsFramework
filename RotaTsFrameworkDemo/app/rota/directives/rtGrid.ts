import {IMainConfig} from '../config/config.interface';

interface IGridDirectiveAttrs extends ng.IAttributes {
    options?: uiGrid.IGridOptions;
}

gridDirective.$inject = ['$compile', 'Config'];
function gridDirective($compile: ng.ICompileService, config: IMainConfig) {

    function link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IGridDirectiveAttrs): void {
        var htmlMarkup = '<div class="grid" ui-grid=' + (attrs.options || config.gridDefaultOptionsName) +
            ' ui-grid-selection ui-grid-pinning ui-grid-pagination ui-grid-exporter></div>';
        var liveHtml = $compile(htmlMarkup)(scope);
        element.append(liveHtml);

    }

    const directive = <ng.IDirective>{
        restrict: 'E',
        replace: true,
        link: link
    };
    return directive;
}

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtgrid', []);
module.directive('rtGrid', gridDirective);
//#endregion
