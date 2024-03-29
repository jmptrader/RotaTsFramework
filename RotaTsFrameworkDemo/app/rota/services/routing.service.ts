﻿//#region Imports
import {IRouteConfig, IRouting, IRotaState, IMenuModel, IMenuItem,
    IHierarchicalMenuItem, IBreadcrumb} from "./routing.interface";
import {ILoader} from './loader.interface';
import {ILogger} from './logger.interface';
import {ICommon, IRotaRootScope} from './common.interface';
import {IMainConfig} from '../config/config.interface';
//Modules
import "./routing.config";
import "./loader.service";
import * as _ from "underscore";
//#endregion

//#region Routing Service
class Routing implements IRouting {
    //#region Props
    serviceName: string = "Routing Service";
    /**
     * Orj Menus 
     */
    private _states: IMenuModel[];
    get states(): IMenuModel[] { return this._states; }
    /**
     * Hierarchical menus
     */
    private _menus: IHierarchicalMenuItem[];
    get menus(): IHierarchicalMenuItem[] { return this._menus; }
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
     * Get current state
     * @returns IRotaState{}
     */
    get current(): IRotaState { return this.$state.current; }
    //#endregion

    static $inject = ['$state', '$stateParams', '$rootScope', '$q', '$urlRouter', '$location',
        '$timeout', 'StateProvider', 'RouteConfig', 'Loader', 'Common', 'Config', 'Logger'];
    //ctor
    constructor(private $state: ng.ui.IStateService,
        private $stateParams: ng.ui.IStateParamsService,
        private $rootScope: IRotaRootScope,
        private $q: angular.IQService,
        private $urlRouter: ng.ui.IUrlRouterService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private stateProvider: ng.ui.IStateProvider,
        private routeconfig: IRouteConfig,
        private loader: ILoader,
        private common: ICommon,
        private config: IMainConfig,
        private logger: ILogger) {
        //Register static states and events
        this.init();
    }
    /**
     * Register static states and events
     */
    private init(): void {
        //Master Page sections register
        this.registerShellSections();
        //Map static maps
        this.registerStaticPages();
        //State eventleri register ediyoruz
        this.registerEvents();
    }
    /**
     * Register state events 
     */
    private registerEvents(): void {
        this.$rootScope.$on('$stateChangeSuccess', (event, toState: IRotaState) => {
            /**
             * Find parent abstract state if state is partial
             */
            const getMenu = (_menu?: IHierarchicalMenuItem): IHierarchicalMenuItem => {
                let menu = _menu || toState.hierarchicalMenu;
                while (menu && menu.isNestedState) {
                    menu = menu.parentMenu;
                }
                return menu;
            }
            /**
             * Set breadcrumb datasource
             */
            const setBreadcrumb = (): void => {
                let menu = getMenu();
                const routelist: IBreadcrumb[] = [];
                while (menu) {
                    routelist.push(
                        {
                            text: menu.title,
                            url: menu.menuUrl || this.getUrlByState(menu.state)
                        });
                    menu = menu.parentMenu && getMenu(menu.parentMenu);
                }
                this._breadcrumbs = routelist.reverse();
            }
            /**
             * Set current main menu 
             */
            const setActiveMenu = (): void => {
                //find parent abstract state if state is partial
                const menu = getMenu();
                if (toState.name === 'shell' || menu !== this.activeMenu) {
                    this._activeMenu = menu;
                    this.$rootScope.$broadcast(this.config.eventNames.menuChanged, menu);
                }
            }

            if (!toState) return;
            setActiveMenu();
            setBreadcrumb();
        });
        this.$rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
            if (!error) return;
            //TODO:Hata tipine gore işlem yapılmali
            switch (error.status) {
                //Not found
                case 404:
                    this.go('shell.error404');
                    break;
                //Internal Error
                case 500:
                    this.go('shell.error500');
                    break;
            }
        });
    }
    /**
     * Register static pages
     */
    private registerStaticPages(): void {
        //404 page
        this.registerState({
            name: 'shell.error404',
            url: 'error404',
            templateUrl: this.routeconfig.error404StateUrl
        });
        //500 page
        this.registerState({
            name: 'shell.error500',
            url: 'error500',
            templateUrl: this.routeconfig.error500StateUrl
        });
    }
    /**
     * Register shell section
     * @param statename State name
     * @param sections Sections
     * @param url url
     * @param sticky Sticky flag
     * @param resolve Resolve promise
     */
    private registerShellSection(statename: string, sections: any[], abstract?: boolean,
        url?: string, sticky?: boolean, resolve?: any): void {
        var views: { [name: string]: ng.ui.IState } = {};
        sections.forEach(section => {
            for (let state in section) {
                views[state] = {
                    templateUrl: this.routeconfig.baseUrl + this.routeconfig.shellPath + section[state].templateUrl,
                    controller: section[state].controller,
                    controllerAs: section[state].controllerAs
                };
            }
        });
        this.stateProvider.state(statename, <ng.ui.IStickyState>{
            abstract: abstract,
            url: url,
            views: views,
            sticky: sticky,
            resolve: resolve
        });
    }
    /**
    * Register shell sections
    */
    private registerShellSections(): void {
        //shell sections
        const shellSections = [
            { 'shell@': { templateUrl: 'shell.html', controller: 'ShellController', controllerAs: this.routeconfig.shellControllerAlias } },
            { 'header@shell': { templateUrl: 'header.html' } },
            { 'footer@shell': { templateUrl: 'footer.html' } }
        ],
            contentSections = [{ '@shell': { templateUrl: 'content.html' } },
                { 'breadcrumb@shell.content': { templateUrl: 'breadcrumb.html' } },
                { 'notification@shell.content': { templateUrl: 'notification.html' } },
                { 'badges@shell.content': { templateUrl: 'badges.html' } }
            ];
        //register shell state
        //UNDONE:add shell promise
        this.registerShellSection("shell", shellSections, false, this.routeconfig.baseUrl, true);
        //register content state
        this.registerShellSection("shell.content", contentSections, true);
    }
    /**
     * Get states by parentId
     * @param parentId State parentId
     */
    private getStatesByParentId(parentId?: number): IMenuModel[] {
        const menus = _.filter(this._states, (item: IMenuModel) => {
            return item.parentId === parentId;
        }); //get it ordered
        const menusOrdered = _.sortBy(menus, "order");
        return menusOrdered;
    }
    /**
     * Convert states to hierarchical node way
     */
    private toHierarchicalMenu(): IHierarchicalMenuItem[] {
        const rootMenus = this.getStatesByParentId();

        if (!rootMenus.length) {
            this.logger.console.warn({ message: 'root menus not found' });
        }
        //generate menus recursively
        return this.getMenusRecursively(rootMenus);
    }
    /**
     * Get states (menus) recursively
     * @param parentStates Parent states
     * @param parentMenu Parent menu
     */
    private getMenusRecursively(parentStates: IMenuModel[], parentMenu?: IMenuItem): IHierarchicalMenuItem[] {
        var menus: IHierarchicalMenuItem[] = [];
        parentStates.forEach((state: IMenuModel) => {
            var menu = angular.copy<IHierarchicalMenuItem>(state);
            menu.parentMenu = parentMenu;
            menu.state = state.name;

            state.hierarchicalMenu = menu;
            //Set substates
            var subStates = this.getStatesByParentId(state.id);
            if (subStates.length) {
                menu.subMenus = this.getMenusRecursively(subStates, menu);
            }
            menus.push(menu);
        });
        return menus;
    }
    /**
     * Register states
     */
    private registerStates(): void {
        //filter to get real states 
        const states: IMenuModel[] = _.filter(this._states, (state: IMenuModel) => {
            return !!state.name;
        });
        //register states
        states.forEach((state: IMenuModel) => {
            this.registerState(state);
        });
    }
    /**
     * Register state
     * @param state State
     */
    private registerState(state: IRotaState): IRouting {
        //Check if already defined
        if (this.getState(state.name)) {
            this.logger.console.warn({ message: 'state already registered ' + state.name });
            return null;
        }
        //set temlate path based on baseUrl - works both html and dynamic file server
        const templateFilePath = (this.common.isHtml(<string>state.templateUrl) ?
            this.routeconfig.basePath : '') + state.templateUrl;
        //#region Define State Object
        //find menu
        //State Object
        const stateObj: IRotaState = {
            abstract: state.abstract,
            template: state.template,
            templateUrl: templateFilePath,
            controller: state.controller,
            //ControllerAs syntax used as default 'vm'
            controllerAs: state.controllerAs || this.routeconfig.contentControllerAlias,
            hierarchicalMenu: state.hierarchicalMenu,
            url: '/' + state.url,
            //HACK:Tum paramlara navItems array parmetresini ekliyoruz!
            params: angular.extend({ id: 'new', navItems: { array: true }, model: null }, state.params),
            //Resolve params
            resolve: {
                stateOptions: () => { return { isNestedState: state.hierarchicalMenu.isNestedState }; },
                $modalInstance: () => angular.noop(),
                modalParams: () => angular.noop(),
                //UNDONE:authoritye gore set edilmeli - return menu && menu.authority;
                authority: () => angular.noop()
            }
        };
        //#endregion

        //Controller load
        if (angular.isString(stateObj.controller)) {
            const cntResolve = this.loader.resolve({
                controllerUrl: state.controllerUrl,
                templateUrl: <string>state.templateUrl
            });
            stateObj.resolve = angular.extend(stateObj.resolve, cntResolve);
        } else {
            //if no controller defined and abstarct is set,generic template injected here
            if (state.abstract) {
                stateObj.template = '<div ui-view></div>';
            }
        }

        //Authentication
        //UNDONE:State lere security promise eklenmeli
        //stateObj.resolve = angular.extend(stateObj.resolve, self.getAuthPromise(state));
        //register state
        this.stateProvider.state(state.name, stateObj);
        return this;
    }
    /**
     * Get state by name
     * @param stateName
     */
    getState(stateName: string): IRotaState {
        if (!this.common.isAssigned(stateName)) return undefined;
        return <IRotaState>this.$state.get(stateName);
    }
    /**
     * Add states with menu definitions
     * @param states States
     */
    addMenus(states: IMenuModel[]): IRouting {
        this._states = states || [];
        this._menus = this.toHierarchicalMenu();
        try {
            this.registerStates();
        } finally {
            this.$urlRouter.sync();
            this.$urlRouter.listen();
        }
        return this;
    }
    /**
     * Go to state
     * @param stateName State name
     * @param params State params
     * @param options State options
     */
    go(stateName: string, params?, options?: ng.ui.IStateOptions): ng.IPromise<any> {
        return this.$state.go(stateName, params, options);
    }
    /**
     * Reload state
     */
    reload(): ng.IPromise<any> {
        return this.$state.reload();
    }
    /**
     * Set the startup state when app get bootstrapped
     * @param defaultState Startup state
     * @param params State params
     */
    start(defaultState: string, params?): void {
        const currentUrl = this.$location.url();

        if (currentUrl === "" || currentUrl === "/") {
            this.$timeout(() => {
                defaultState ? this.go(defaultState, params) :
                    this.go(this.routeconfig.startUpState || 'shell');
            }, 0);
        }
    }
    /**
     * Get href uri from state
     * @param stateName State Name
     * @param params Optional params
     */
    getUrlByState(stateName: string, params?: any): string {
        return this.$state.href(stateName, params);
    }

}
//#endregion

//#region Config
var config = ($provide: ng.auto.IProvideService,
    $stateProvider: ng.ui.IStateProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
    //Register state provider
    $provide.factory('StateProvider', () => $stateProvider);
    //Location değişikliklerini biz yonetiyoruz,Db den lazy yukledigimiz icin.Bkz: addStates method
    $urlRouterProvider.deferIntercept();
    //Otherwise path
    $urlRouterProvider.otherwise('/error404');
}
config.$inject = ['$provide', '$stateProvider', '$urlRouterProvider'];
//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.services.routing', ['rota.services.routing.config', 'rota.services.loader', 'ui.router']);

module.service('Routing', Routing)
    .config(config);
//#endregion

export {Routing}