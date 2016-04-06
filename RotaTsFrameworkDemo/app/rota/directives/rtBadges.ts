//import {ILocalization} from '../services/localization.interface';
//import {ICommon} from '../services/common.interface';
//import {BadgeTypes} from '../services/titlebadges.interface'
////#region Interfaces
///**
// * Title badge
// */
//interface ITitleBadge {
//    /**
//     * Title color - success,info,warning,danger
//     */
//    color: string;
//    /**
//     * Fontawesome icon
//     */
//    icon?: string;
//    /**
//     * Tooltip info
//     */
//    tooltip?: string;
//    /**
//     * Text information of badge
//     */
//    description?: string;
//    /**
//     * Flag that set visibility
//     */
//    show?: boolean;
//}
//interface IBadgesAttributes extends ng.IAttributes {
//}

//interface IBadgesScope extends ng.IScope {
//    badges:
//}
////#endregion

////#region Directive
//function badgesDirective(localization: ILocalization, common: ICommon) {

//    function link(scope: IBadgesScope, element: ng.IAugmentedJQuery, attrs: IBadgesAttributes): void {
//        scope.$on('addbadge', (event: ng.IAngularEvent, badge: ITitleBadge) => {

//        });

//        scope.$on('removebadge', (event: ng.IAngularEvent, badgeType: BadgeTypes) => {

//        });
//    }

//    const directive = <ng.IDirective>{
//        restrict: 'AE',
//        replace: true,
//        scope: {},
//        link: link,
//        template: '<span ng-repeat="(notifyType,notifyItem) in badges" ' +
//        'ng-class="[\'anim-fadeinleft\',\'margin-right-2\',\'badge\', \'alert-\' + notifyItem.color]" ' +
//        'ng-if="notifyItem.show" tooltip-html="notifyItem.tooltip" tooltip-placement="bottom">' +
//        '<i ng-if="notifyItem.icon" ng-class="[\'fa\',\'fa-\' + notifyItem.icon]"></i>{{notifyItem.description}}</span>'
//    };
//    return directive;
//}
//badgesDirective.$inject = ['Localization', 'Common'];
////#endregion

////#region Register
//var module: ng.IModule = angular.module('rota.directives.rtbadges', []);
//module.directive('rtBadges', badgesDirective);
////#endregion
