//#region Imports
import {IMainConfig} from '../config/config.interface';
import {ICommon} from '../services/common.interface';
import {IRotaState, IRouting} from "../services/routing.interface";
//#endregion

//#region Interfaces
/**
 * Datetime scope
 */
interface ITabsScope extends ng.IScope {
    tabs: ITab[]
}

export interface ITab {
    heading: string;
    icon?: string;
    state: string;
    params?: any;
    disable?: boolean;
    active?: boolean;
}
//#endregion

//#region Ui-Tabs wrapper


class TabsController {
    tabs: ITab[];
    constructor($rootScope: ng.IRootScopeService, private $scope: ITabsScope,
        private $state: ng.ui.IStateService, private common: ICommon, private routing: IRouting) {
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

    isActive(tab: ITab): boolean {
        return this.$state.includes(tab.state, tab.params);
    }

    go(tab: ITab): void {
        const isCurrentState = this.$state.is(tab.state, tab.params);

        if (!isCurrentState && !tab.disable) {
            this.routing.go(tab.state, tab.params);
        }
    }

    refresh(): void {
        this.tabs.forEach((tab: ITab): void => {
            tab.params = tab.params || {};
            tab.active = this.isActive(tab);
            tab.disable = tab.disable;
        });
    }
}

TabsController.$inject = ['$rootScope', '$scope', '$state', 'Common', 'Routing'];

function tabsDirective() {
    function link(scope: ITabsScope, element: ng.IAugmentedJQuery): void {

    }

    //#region Directive Definition
    const directive = <ng.IDirective>{
        restrict: 'E',
        replace: true,
        controller: TabsController,
        link: link,
        controllerAs: 'vm',
        bindToController: {
            tabs: '=data',
            type: '@',
            justified: '@',
            vertical: '@'
        },
        scope: {},
        template: '<div class="rt-tabs"><uib-tabset class="tab-container" type="{{vm.type}}" vertical="{{vm.vertical}}" ' +
        'justified="{{vm.justified}}">' + '<uib-tab class="tab" ng-repeat="tab in vm.tabs"' +
        'active="tab.active" disable="tab.disable" ng-click="vm.go(tab)">' +
        '<uib-tab-heading><i ng-class="[\'fa\', \'fa-\' + tab.icon]"></i> {{::tab.heading}}</uib-tab-heading>' +
        '</uib-tab></uib-tabset>' +
        '<div class="body"><ui-view autoscroll></ui-view></div>' +
        '</div>'
    };
    return directive;
    //#endregion
}
//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.directives.rttabs', []);
module.directive('rtTabs', tabsDirective);
//#endregion
