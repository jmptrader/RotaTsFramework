//#region Imports
import {IMainConfig} from '../config/config.interface';
import {ICommon} from '../services/common.interface';
import {IRotaState, IRouting} from "../services/routing.interface";
//#endregion

//#region Interfaces
/**
 * Tab interface
 */
export interface ITab {
    heading?: string;
    icon?: string;
    state: string;
    params?: any;
    disable?: boolean;
    active?: boolean;
    activeState?: string;
}
//#endregion

//#region Ui-Tabs wrapper
//#region Tabs Controller
class TabsController {
    /**
     * Tabs
     */
    tabs: ITab[];
    /**
     * Tab selected event
     * @param tab Selected Tab
     */
    onSelected: (tab: ITab) => void;

    constructor($rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService, private $scope: ng.IScope, private common: ICommon, private routing: IRouting) {
        if (!common.isArray(this.tabs)) {
            throw new Error('tabs must be defined as array of ITab');
        }

        const offBinds: Function[] = [];
        ['$stateChangeSuccess', '$stateChangeError', '$stateChangeCancel', '$stateNotFound'].forEach((event: string): void => {
            offBinds.push($rootScope.$on(event, this.refresh.bind(this)));
        });
        $scope.$on('$destroy', (): void => {
            offBinds.forEach((offFn): void => {
                offFn();
            });
        });

        this.refresh();
    }
    /**
     * Check if tab is active state
     * @param tab
     */
    isActive(tab: ITab): boolean {
        return this.$state.includes(tab.activeState || tab.state, tab.params);
    }
    /**
     * Got to tab state
     * @param tab Selected Tab
     */
    go(tab: ITab): void {
        const isCurrentState = this.$state.is(tab.state, tab.params);

        if (!isCurrentState && !tab.disable) {
            this.routing.go(tab.state, tab.params);
            this.onSelected(tab);
        }
    }
    /**
     * Refresh all tabs
     */
    refresh(): void {
        this.tabs.forEach((tab: ITab): void => {
            const state = this.routing.getState(tab.state);
            if (!this.common.isAssigned(state)) return;
            tab.params = tab.params || {};
            tab.active = this.isActive(tab);
            tab.disable = tab.disable;
            tab.heading = tab.heading || state.hierarchicalMenu.title;
            tab.icon = tab.icon || state.hierarchicalMenu.menuIcon;
        });
    }
}

//#endregion

//#region Injections
TabsController.$inject = ['$rootScope', '$state', '$scope', 'Common', 'Routing'];
//#endregion

//#region Directive Definition
function tabsDirective() {
    const directive = <ng.IDirective>{
        restrict: 'E',
        replace: true,
        controller: TabsController,
        controllerAs: 'tabvm',
        bindToController: {
            tabs: '=data',
            type: '@',
            justified: '@',
            vertical: '@',
            onSelected: '&'
        },
        scope: true,
        template: '<div class="rt-tabs"><uib-tabset class="tab-container" type="{{tabvm.type}}" vertical="{{tabvm.vertical}}" ' +
        'justified="{{tabvm.justified}}">' + '<uib-tab class="tab" ng-repeat="tab in tabvm.tabs"' +
        'active="tab.active" disable="tab.disable" ng-click="tabvm.go(tab)">' +
        '<uib-tab-heading><i ng-class="[\'fa\', \'fa-\' + tab.icon]"></i> {{::tab.heading}}</uib-tab-heading>' +
        '</uib-tab></uib-tabset>' +
        '<div class="body"><ui-view autoscroll></ui-view></div>' +
        '</div>'
    };
    return directive;
}
//#endregion
//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.directives.rttabs', []);
module.directive('rtTabs', tabsDirective);
//#endregion
