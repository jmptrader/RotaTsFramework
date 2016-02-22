import {ILocalization} from '../services/localization.interface';
//#region Interfaces
interface IPanelScope extends ng.IScope {
    title: string;
    titleI18n: string;
    caption: string;
}
//#endregion

//#region Directive
function panelDirective(localization: ILocalization) {
    function link(scope: IPanelScope, element: ng.IAugmentedJQuery): void {
        scope.caption = scope.title || localization.getLocal(scope.titleI18n);
    }

    const directive = <ng.IDirective>{
        restrict: 'AE',
        scope: {
            title: '@',
            titleI18n: '@',
            icon: '@',
            badge: '@',
            onClicked: '&',
            buttons: '=',
            color: '@'
        },
        transclude: true,
        template: '<div ng-class="color" class="rt-panel"><ul class="nav nav-tabs">' +
        '<li class="active" ng-if="caption"><a class="title" href><b><i ng-class="[\'fa\', \'fa-\' + icon]">' +
        '</i> {{caption}}<span class="badge alert-danger" ' +
        'ng-if="badge">{{badge}}</span></b></a></li>' +
        '<li ng-if="buttons.length" class="rightside">' +
        '<ul class="list-inline">' +
        '<li class="no-padding" ng-repeat="button in buttons track by $index">' +
        '<button ng-class="[\'btn\',\'btn-sm\',\'btn-\' + button.color]" ng-click="onClicked({ code: button.code });">' +
        '<i ng-if="button.icon" ng-class="[\'fa\',\'fa-\' + button.icon]"></i>' +
        '&nbsp;{{::button.text}}</button></li>' +
        '</ul></li></ul>' +
        '<div class="body" ng-hide="minified" ng-transclude></div>' +
        '<div class="clearfix"></div></div>',
        link: link
    };
    return directive;
}

panelDirective.$inject = ['Localization'];
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtpanel', []);
module.directive('rtPanel', panelDirective);
//#endregion
