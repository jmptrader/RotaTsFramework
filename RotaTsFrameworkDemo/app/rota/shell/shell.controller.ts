//#region Imports
import {ICommon, IRotaRootScope} from '../services/common.interface';
import {IRouting, IBreadcrumb, IHierarchicalMenuItem} from '../services/routing.interface';
import {IMainConfig} from '../config/config';
import {INotification, INotify, ILogger} from '../services/logger.interface';
//Routing service is dependency
import "../services/routing.service";
//#endregion

//#region Shell Controller
/**
 * Shell controller 
 */
class ShellController {
    //#region Props
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
     * App title changed depends on route changes
     */
    private _appTitle: string;
    get appTitle(): string { return this._appTitle; }
    //#endregion

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
        //forms availablty in modal
        $rootScope.forms = {};
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
        this.$scope.$watchCollection<IBreadcrumb[]>(() => this.routing.breadcrumbs, newVal => {
            if (newVal) {
                this._breadcrumbs = newVal;
            }
        });
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

    setActiveMenuListener() {
        this.$rootScope.$on(this.config.eventNames.menuChanged, (menu: IHierarchicalMenuItem) => {
            this._activeMenu = menu;
            //set title
            var projectTitle = `${this.config.appTitle} ${this.config.appVersion}`;
            this._appTitle = menu ? (projectTitle + ' ' + menu.title) : projectTitle;
        });
    }
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.shell', []);
module.controller('ShellController', ShellController);
//#endregion
