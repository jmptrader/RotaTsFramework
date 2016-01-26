//#region Imports
import {IHierarchicalMenuItem, IRouting} from '../services/routing.interface';
import * as $ from "jquery";
//#endregion

//#region Interfaces
interface IMenuScope extends ng.IScope {
    subMenuHandler(event: JQueryEventObject): void
}
//#endregion

//#region Directive
menuDirective.$inject = ['$compile', 'Routing'];
function menuDirective($compile: ng.ICompileService, routing: IRouting) {
    function link(scope: IMenuScope, element: ng.IAugmentedJQuery): void {
        var createMenu = (menus: IHierarchicalMenuItem[], isSubMenu: boolean = false): string => {
            var menuHtml = '';
            menus.forEach(menu => {
                if (menu.startGroup) {
                    menuHtml += '<li class="nav-divider"></li>';
                }
                var isSubMenuExists = menu.subMenus && menu.subMenus.length;
                menuHtml += `<li class="${isSubMenuExists ? 'dropdown' : ''}${isSubMenuExists && isSubMenu ? ' dropdown-submenu' : ''}" 
                             ui-sref-active='active'><a ${!isSubMenuExists ? 'ui-sref="' + menu.state + '"' : 'href'}
                             ${isSubMenuExists ? ' class="dropdown-toggle" data-toggle="dropdown" ' : ''}
                             ${isSubMenuExists && isSubMenu ? 'ng-click=\'subMenuHandler($event)\'' : ''}>
                             <i class="fa ${!isSubMenu ? 'fa-lg fa-fw text-primary' : ''} fa-${menu.menuIcon}"></i> 
                             ${menu.title}${isSubMenuExists && !isSubMenu ? '<span class="caret"></span>' : ''}</a>`;
                if (isSubMenuExists) {
                    menuHtml += `<ul class="dropdown-menu">${createMenu(menu.subMenus, true)}</ul>`;
                }
            });
            menuHtml += '</li>';
            return menuHtml;
        };

        scope.$watch(() => routing.menus, menus => {
            if (menus) {
                const htmlMarkup = `<ul class="nav navbar-nav">${createMenu(menus)}</ul>`;
                const liveHtml = $compile(htmlMarkup)(scope);
                element.append(liveHtml);
            }
        });

        //For subMenu support
        //http://www.bootply.com/QutOBjvgha
        scope.subMenuHandler = event => {
            // Avoid following the href location when clicking
            event.preventDefault();
            // Avoid having the menu to close when clicking
            event.stopPropagation();
            // If a menu is already open we close it
            var $parentUl = $('li.dropdown-submenu.open', $(event.target).parents('ul.dropdown-menu:first'));
            $parentUl.removeClass('open');
            // opening the one you clicked on
            $(event.target).parent().addClass('open');

            var menu = $(event.target).parent().find("ul");
            var menupos = menu.offset();
            var newpos: number;

            if ((menupos.left + menu.width()) + 30 > $(window).width()) {
                newpos = -menu.width();
            } else {
                newpos = $(event.target).parent().width();
            }
            menu.css({ left: newpos });
        };
    }

    const directive = <ng.IDirective>{
        restrict: 'A',
        link: link
    };
    return directive;
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rtmenu', []);
module.directive('rtMenu', menuDirective);
//#endregion
