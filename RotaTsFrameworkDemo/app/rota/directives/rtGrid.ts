//#region Imports
import {IMainConfig} from '../config/config.interface';
import {IGridOptions} from '../base/interfaces';
import {ICommon} from '../services/common.interface';
//#endregion

//#region Interfaces
interface IGridDirectiveAttrs extends ng.IAttributes {
    /**
     * Grid option name
     * @description its defined as defaultvalue in config for list controllers  
     */
    gridOptions?: string;
    /**
     * ui-grid features defined in directives
     * @example ui-grid-selection ui-grid-pinning ui-grid-pagination ui-grid-exporter
     */
    gridFeatureList?: string;
    /**
     * List height
     */
    height: number;
}
//#endregion

//#region Ui-Grid wrapper
function gridDirective(config: IMainConfig, common: ICommon) {
    function compile(cElement: ng.IAugmentedJQuery, cAttrs: IGridDirectiveAttrs) {
        const optionsName = common.isNullOrEmpty(cAttrs.gridOptions) ? config.gridDefaultOptionsName : cAttrs.gridOptions;
        const featureList = common.isNullOrEmpty(cAttrs.gridFeatureList) ? config.gridFullFeatureList : cAttrs.gridFeatureList;
        const htmlMarkup = `<div class="grid" ui-grid="${optionsName}" ${featureList}></div>`;
        cElement.append(htmlMarkup);
        return (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IGridDirectiveAttrs): void => {
        }
    }
    //#region Directive Definition
    const directive = <ng.IDirective>{
        restrict: 'E',
        replace: true,
        compile: compile
    };
    return directive;
    //#endregion
}

//#region Injections
gridDirective.$inject = ['Config', 'Common'];
//#endregion
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtgrid', []);
module.directive('rtGrid', gridDirective);
//#endregion
