import {ILocalization} from '../services/localization.interface';
import {ICommon} from '../services/common.interface';
//#region Interfaces
interface IButtonAttributes extends ng.IAttributes {
    iconToRight: boolean;
}

interface IButtonScope extends ng.IScope {
    text: string;
    caption: string;
    spin: string;
    icon: string;
    doclick(e: ng.IAngularEvent): void;
    click(e: ng.IAngularEvent): ng.IPromise<any> | any;
}
//#endregion

//#region Directive
function buttonDirective(timeout: ng.ITimeoutService, localization: ILocalization, common: ICommon) {
    const pendingText = localization.getLocal('rota.lutfenbekleyiniz');
    function link(scope: IButtonScope, element: ng.IAugmentedJQuery): void {
        //get original items
        let orjText = scope.text;
        const orjIcon = scope.icon;
        scope.$watchGroup(['textI18n', 'text'], (data: any[]) => {
            orjText = scope.caption = data[1] || (data[0] && localization.getLocal(data[0]));
        });
        //methods
        const setButtonAttrs = (caption: string, icon: string, showSpin?: boolean) => {
            scope.caption = caption;
            scope.icon = icon;
            scope.spin = showSpin && 'fa-spin';
        }
        const startAjax = () => {
            element.attr('disabled', 'disabled');
            setButtonAttrs(pendingText, 'refresh', true);
        };
        const endAjax = () => {
            element.removeAttr('disabled');
            setButtonAttrs(orjText, orjIcon);
        };
        scope.doclick = e => {
            const result = scope.click(e);
            if (common.isPromise(result)) {
                startAjax();
                result.finally(() => {
                    timeout(() => endAjax(), 0);
                });
            }
        };
    }
    const directive = <ng.IDirective>{
        restrict: 'AE',
        replace: true,
        scope: {
            text: '@',
            textI18n: '@',
            icon: '@',
            color: '@',
            click: '&',
            size: '@'
        },
        templateUrl: (elem: ng.IAugmentedJQuery, attr: IButtonAttributes) => (angular.isDefined(attr.iconToRight) ?
            'rota/rtbutton-r.tpl.html' : 'rota/rtbutton-l.tpl.html'),
        link: link
    };
    return directive;
}
buttonDirective.$inject = ['$timeout', 'Localization', 'Common'];
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtbutton', []);
module.directive('rtButton', buttonDirective);
module.run([
    '$templateCache', ($templateCache: ng.ITemplateCacheService) => {
        $templateCache.put('rota/rtbutton-r.tpl.html',
            '<a href ng-class="[\'btn\', \'btn-\' + color,\'btn-\' +size]" ng-click="doclick($event)" ' +
            'tooltip-placement="bottom">' +
            '<span class="hidden-sm hidden-xs">' +
            '{{caption}}</span>&nbsp;<i ng-if="icon" ng-class="[\'fa\', \'fa-\' + icon,spin]"></i></a>');
        $templateCache.put('rota/rtbutton-l.tpl.html',
            '<a href ng-class="[\'btn\', \'btn-\' + color,\'btn-\' +size]" ng-click="doclick($event)" ' +
            'tooltip-placement="bottom">' +
            '<i ng-if="icon" ng-class="[\'fa\', \'fa-\' + icon,spin]"></i><span class="hidden-sm hidden-xs">' +
            '{{caption}}</span></a>');
    }])
//#endregion
