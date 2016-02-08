//#region Interfaces
interface IButtonAttributes extends ng.IAttributes {
    iconToRight: boolean;
}

interface IButtonScope extends ng.IScope {
}
//#endregion

//#region Directive
function buttonDirective() {
    function link(scope: IButtonScope, element: ng.IAugmentedJQuery): void {
    }

    const directive = <ng.IDirective>{
        restrict: 'AE',
        replace: true,
        scope: {
            text: '@_text',
            textI18n: '@',
            icon: '@',
            color: '@',
            click: '&',
            clickonce: '=?',
            size: '@'
        },
        templateUrl: (elem: ng.IAugmentedJQuery, attr: IButtonAttributes) => (angular.isDefined(attr.iconToRight) ?
            'rota/rtbutton-r.tpl.html' : 'rota/rtbutton-l.tpl.html'),
        link: link
    };
    return directive;
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtbutton', []);
module.directive('rtButton', buttonDirective);
module.run([
    '$templateCache', ($templateCache: ng.ITemplateCacheService) => {
        $templateCache.put('rota/rtbutton-r.tpl.html',
            '<button type="{{type}}" ng-class="[\'btn\', \'btn-\' + color,\'btn-\' +size]" ng-click="doclick($event)" ' +
            'tooltip-placement="bottom">' +
            '<span class="hidden-sm hidden-xs">' +
            '{{text}}</span>&nbsp;<i ng-if="icon" ng-class="[\'fa\', \'fa-\' + icon,spin]"></i></button>');
        $templateCache.put('rota/rtbutton-l.tpl.html',
            '<button type="{{type}}" ng-class="[\'btn\', \'btn-\' + color,\'btn-\' +size]" ng-click="doclick($event)" ' +
            'tooltip-placement="bottom">' +
            '<i ng-if="icon" ng-class="[\'fa\', \'fa-\' + icon,spin]"></i><span class="hidden-sm hidden-xs">' +
            '{{text}}</span></button>');
    }])
//#endregion
