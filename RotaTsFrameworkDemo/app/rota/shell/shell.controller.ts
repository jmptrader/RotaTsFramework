//#region Imports
import {ICommon, IRotaRootScope} from '../services/common.interface';
import {IRouting, IBreadcrumb, IHierarchicalMenuItem} from '../services/routing.interface';
import {IMainConfig} from '../config/config.interface';
import {INotification, INotify, ILogger} from '../services/logger.interface';
import {ITitleBadges, ITitleBadge} from '../services/titlebadges.interface';
import {IShellScope} from './shell.interface';
import {ILocalization, ILanguage} from '../services/localization.interface';
//deps
import "../services/routing.service";
import "../config/config";
import "../services/logger.service";
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
    get notifications(): INotify[] { return this._notifications; }

    /**
     * Title Badges
     */
    private _badges: { [index: number]: ITitleBadge };
    get badges(): { [index: number]: ITitleBadge } { return this._badges; }
    set badges(value: { [index: number]: ITitleBadge }) { this._badges = value; }

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

    //#endregion

    //#region Init
    static $inject = ['$rootScope', '$scope', 'Routing', 'Config', 'Logger', 'TitleBadges', 'Localization'];
    constructor(private $rootScope: IRotaRootScope,
        private $scope: IShellScope,
        private routing: IRouting,
        private config: IMainConfig,
        private logger: ILogger,
        private titleBadges: ITitleBadges,
        private localization: ILocalization) {
        //init settings
        this.setSpinner();
        this.setNotificationListener();
        this.setBreadcrumbListener();
        this.setActiveMenuListener();
        this.setTitleBadgesListener();
        //forms availablty in modal
        $rootScope.forms = {};
        $scope.isCollapsed = true;
        $scope.supportedLanguages = this.config.supportedLanguages;
        $scope.currentLanguage = localization.currentLanguage;
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
     * Set title badges
     */
    private setTitleBadgesListener() {
        this.$scope.$watch(() => this.titleBadges.badges, (newValue) => {
            if (newValue) {
                this.badges = newValue;
            }
        }, true);

        this.$rootScope.$on(this.config.eventNames.menuChanged, () => {
            this.titleBadges.clearBadges();
        });
    }

    //#endregion

    //#region Shell Methods
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
    /**
     * Change current language
     * @param $event Event
     * @param lang Language to be changed to
     */
    changeLanguage($event: ng.IAngularEvent, lang: ILanguage) {
        this.localization.currentLanguage = lang;
        $event.preventDefault();
    }

    //#endregion
}
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.shell', []);
module.controller('ShellController', ShellController);
//#endregion
