import {Logger, ILogger} from "../services/logger";
import {Common, ICommon} from "../services/common";

interface IBundle {
    [s: string]: any;
}
interface IBaseController {
    $rootScope: ng.IRootScopeService;
    $q: angular.IQService;
    $http: ng.IHttpService;
    $scope: ng.IScope;
    $stateParams: ng.ui.IStateParamsService;
    $window: ng.IWindowService;
    logger: ILogger;
    common: ICommon;

    goBack(): void;
}

class BaseController implements IBaseController {
    $rootScope: ng.IRootScopeService;
    $q: ng.IQService;
    $http: ng.IHttpService;
    $scope: ng.IScope;
    $window: ng.IWindowService;
    $stateParams: ng.ui.IStateParamsService;
    logger: ILogger;
    common: ICommon;

    constructor(bundle: IBundle, ...args: any[]) {
        this.initBundle(bundle);
        return this;
    }

    initBundle(bundle: IBundle): void {
        this.$rootScope = bundle['$rootScope'];
        this.$q = bundle['$q'];
        this.$scope = bundle['$scope'];
        this.$http = bundle['$http'];
        this.logger = bundle["logger"];
        this.common = bundle["common"];
        this.$stateParams = bundle["$stateParams"];
        this.$window = bundle["$window"];
    }

    goBack(): void {
        this.$window.history.back();
    }
}
//Export
export {IBaseController, BaseController, IBundle}
