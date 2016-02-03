//#region Imports
import {ICommon, IRotaRootScope} from '../services/common.interface';
import {IRouting, IBreadcrumb, IHierarchicalMenuItem} from '../services/routing.interface';
import {IMainConfig} from '../config/config';
import {INotification, INotify, ILogger} from '../services/logger.interface';
import {IBadge, BadgeType} from './shell.interface';
//Dependencies
import "../services/routing.service";
import "../config/config";
import "../services/logger.service";
//#endregion

//#region Shell Controller
/**
 * Shell controller 
 */
class ShellController {
    /**
     * Indicate whether the spinner will be shown
     */
    private _isBusy: boolean;
    get isBusy(): boolean { return this._isBusy; }
    /**
     * Notification panels
     */
    private _notifications: INotify[];
    get notifications(): INotify[] { return null; }
    /**
     * Ajax spinner options
     */
    private _spinnerOptions: SpinnerOptions;
    get spinnerOptions(): SpinnerOptions { return this._spinnerOptions; }
    /**
     * Breadcrumbs
     */
    private _breadcrumbs: IBreadcrumb[];
    get breadcrumbs(): IBreadcrumb[] { return this._breadcrumbs; }
    /**
   * Active Menu
   */
    private _activeMenu: IHierarchicalMenuItem;
    get activeMenu(): IHierarchicalMenuItem { return this._activeMenu; }
    /**
     * Menu badges
     */
    private _badges: IBadge[];
    get badges(): IBadge[] { return this._badges; }

    static $inject = ['$rootScope', '$scope', 'Routing', 'Config', 'Logger'];
    constructor(private $rootScope: IRotaRootScope,
        private $scope: ng.IScope,
        private routing: IRouting,
        private config: IMainConfig,
        private logger: ILogger) {
        //init settings
        this.setSpinner();
        this.setNotificationListener();
        this.setBreadcrumbListener();
        this.setActiveMenuListener();
        this.initBadgerItems();
        //forms availablty in modal
        $rootScope.forms = {};
        $rootScope.isCollapsed = true;
    }
    /**
     * Set spinner settings
     */
    private setSpinner() {
        //register main spinner events
        this.$rootScope.$on(this.config.eventNames.ajaxStarted, () => {
            this._isBusy = true;
        });
        this.$rootScope.$on(this.config.eventNames.ajaxStarted, () => {
            this._isBusy = false;
        });
        //spinner settings
        this._spinnerOptions = {
            lines: 13, // The number of lines to draw
            length: 1, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#FFC280', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };
    }
    /**
    * Set notification listener
    */
    private setNotificationListener() {
        this.$scope.$watchCollection<INotify[]>(() => (<INotification>this.logger.notification).currentNotifications,
            (newValue: INotify[]) => {
                if (newValue) {
                    this._notifications = newValue;
                }
            });
    }
    /**
     * Set breadcrumb listener
     */
    private setBreadcrumbListener() {
        this.$scope.$watch<IBreadcrumb[]>(() => this.routing.breadcrumbs, newVal => {
            if (newVal) {
                this._breadcrumbs = newVal;
            }
        });
    }
    /**
     * Set active menu & app title
     */
    private setActiveMenuListener() {
        this.$scope.$watch<IHierarchicalMenuItem>(() => this.routing.activeMenu, (menu) => {
            this._activeMenu = menu;
            //set app title
            var projectTitle = `${this.config.appTitle} ${this.config.appVersion}`;
            this.$rootScope.appTitle = menu ? (projectTitle + ' ' + menu.title) : projectTitle;
        });
    }
    /**
   * Init menu badge items
   */
    private initBadgerItems() {
        this.$rootScope.$on(this.config.eventNames.badgeChanged, (event: ng.IAngularEvent, badge: BadgeType, show: boolean) => {
            this._badges[badge].show = show;
        });
        this._badges = [
            {
                color: 'info',
                icon: 'edit',
                text: 'kayitduzeltme' //localization.get('rota.kayitduzeltme')
            },
            //Form New Item Mode
            {
                color: 'info',
                icon: 'plus',
                text: 'yenikayit' //localization.get('rota.yenikayit')
            },
            //Form Invalid
            {
                color: 'danger',
                icon: 'exclamation',
                tooltip: 'zorunlualanlarvar' //localization.get('rota.zorunlualanlarvar')
            },
            //Form Editing Started
            {
                color: 'success',
                icon: 'pencil',
                tooltip: 'duzeltiliyor' //localization.get('rota.duzeltiliyor')
            },
            //List record count
            {
                color: 'success',
                icon: 'check',
                tooltip: 'kayitsayisi' //localization.get('rota.kayitsayisi')
            }
        ];
    }
    /**
    * Refresh state
    */
    refresh(): void {
        this.routing.reload();
    }
    /**
     * Remove notification
     * @param notification
     */
    removeNotification(notification: INotify) {
        (<INotification>this.logger.notification).removeNotification(notification);
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.shell', []);
module.controller('ShellController', ShellController);
//#endregion
