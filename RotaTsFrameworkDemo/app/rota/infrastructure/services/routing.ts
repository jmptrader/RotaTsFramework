//#region Routing Service
interface IRouting {
    addStates(state: angular.ui.IState[]): IRouting;
    go(state: string, params?: any): ng.IPromise<any>;
}

class RoutingService implements IRouting {
    static $inject = ['$state', '$stateParams', 'StateProvider', '$rootScope', '$q', '$urlRouter'];
    constructor(private $state: ng.ui.IStateService,
        private $stateParams: ng.ui.IStateParamsService,
        private stateProvider: ng.ui.IStateProvider,
        private $rootScope: ng.IRootScopeService,
        private $q: angular.IQService,
        private $urlRouter: ng.ui.IUrlRouterService) {
    }
    addStates(states: angular.ui.IState[]): IRouting {
        states.forEach((state: ng.ui.IState) => {
            state.controllerAs = "vm";
            //Controller file load
            var controllerFilePath = (<string>state.templateUrl).replace('.html', '.controller.js');
            state.resolve = {};
            state.resolve["loadfile"] = () => this.loadControllerFile(controllerFilePath);
            //Register state
            this.stateProvider.state(state.name, state);
        });
        this.$urlRouter.sync();
        this.$urlRouter.listen();
        return this;
    }

    go(state: string, params?: any): ng.IPromise<any> {
        return this.$state.go(state, params);
    }

    loadControllerFile(filePath: string): ng.IPromise<any> {
        var d = this.$q.defer();
        require([filePath], () => {
            d.resolve();
            this.$rootScope.$apply();
        });
        return d.promise;
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
var module: ng.IModule = angular.module('rota.routing.service', ['ui.router']);

module.service('Routing', RoutingService)
    .config(config);
//#endregion

//Export
export {IRouting, RoutingService}