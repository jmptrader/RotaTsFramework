//#region Imports
//interfaces
import {IRotaRootScope} from './common.interface';
import {IRouting} from './routing.interface';
import {IMainConfig} from '../config/config.interface';
import {ICommon} from './common.interface';
import {ILoader} from './loader.interface';
import {IRouteConfig} from './routing.interface';
import {IDialogOptions, IDialogScope, IConfirmOptions, IConfirmScope,
    IProgressOptions, IProgressScope, IProgressModalInstance, IPromptOptions,
    IPromptScope, IFileUploadOptions, IFileUploadScope, IModalOptions, IDialogs} from './dialogs.interface';
import {ILocalization} from './localization.interface';
import {IBaseModel} from '../base/interfaces';
//deps
import {App} from "../config/app";
import {IRotaApp} from "../config/app.interface";
import {BaseModalController} from '../base/basemodalcontroller';

//#endregion

//#region Dialog Service
/**
 * Dialog service
 */
class Dialogs implements IDialogs {
    serviceName = 'Dialog Service';
    static defaultModalControllerName: string = 'defaultModalController';

    static $inject = ['$rootScope', '$q', '$uibModal', 'Routing', 'Config', 'RouteConfig', 'Common', 'Loader', 'Localization'];
    constructor(private $rootScope: IRotaRootScope,
        private $q: ng.IQService,
        private $modal: ng.ui.bootstrap.IModalService,
        private routing: IRouting,
        private config: IMainConfig,
        private routeconfig: IRouteConfig,
        private common: ICommon,
        private loader: ILoader,
        private localization: ILocalization) {
    }

    //#region Dialogs
    /**
     * Show simple dialog with ok button
     * @param options Dialog options
     */
    showDialog(options: IDialogOptions): ng.IPromise<any> {
        const modalOptions: ng.ui.bootstrap.IModalSettings = {
            templateUrl: 'modalSimpleDialog.tpl.html',
            controller: ['$scope', '$uibModalInstance', 'options',
                ($scope: IDialogScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IDialogOptions) => {
                    $scope.title = options.title || this.localization.getLocal('rota.onay');
                    $scope.message = options.message || '';
                    $scope.okText = options.okText || this.localization.getLocal('rota.ok');
                    $scope.ok = () => { $modalInstance.close('ok'); };
                }],
            keyboard: true,
            windowClass: options.windowClass,
            resolve: {
                options: () => {
                    return {
                        title: options.title,
                        message: options.message,
                        okText: options.okText
                    };
                }
            }
        };
        return this.$modal.open(modalOptions).result;
    }
    /**
     * Show confirm dialog with ok,cancel buttons
     * @param options Confirm options
     */
    showConfirm(options: IConfirmOptions): ng.IPromise<any> {
        const modalOptions: ng.ui.bootstrap.IModalSettings = {
            templateUrl: 'modalDialog.tpl.html',
            controller: ['$scope', '$uibModalInstance', 'options',
                ($scope: IConfirmScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IConfirmOptions) => {
                    $scope.title = options.title || this.localization.getLocal('rota.onay');
                    $scope.message = options.message || '';
                    $scope.okText = options.okText || this.localization.getLocal('rota.ok');
                    $scope.cancelText = options.cancelText || this.localization.getLocal('rota.iptal');
                    $scope.ok = () => { $modalInstance.close('ok'); };
                    $scope.cancel = () => { $modalInstance.dismiss('cancel'); };
                }],
            keyboard: true,
            windowClass: options.windowClass,
            resolve: {
                options: () => {
                    return {
                        title: options.title,
                        message: options.message,
                        okText: options.okText,
                        cancelText: options.cancelText
                    };
                }
            }
        };
        return this.$modal.open(modalOptions).result;
    }
    /**
     * Show progress based on percent value
     * @param options Progress dialog options
     */
    showProgress(options: IProgressOptions): IProgressModalInstance {
        const modalOptions: ng.ui.bootstrap.IModalSettings = {
            templateUrl: 'modalProgress.tpl.html',
            controller: ['$scope', '$timeout', '$uibModalInstance', 'options',
                ($scope: IProgressScope, $timeout: ng.ITimeoutService,
                    $modalInstance: IProgressModalInstance, options: IProgressOptions) => {
                    $modalInstance.percent =
                        $scope.percent = options.percent || 0;
                    $scope.$watch(() => $modalInstance.percent, value => {
                        $scope.percent = value;
                        if (value >= 100) {
                            $timeout(() => {
                                $modalInstance.dismiss();
                            }, 500);
                        }
                    });
                    $scope.title = options.title || this.localization.getLocal('rota.lutfenbekleyiniz');
                }],
            keyboard: false,
            windowClass: "modal fade in",
            backdrop: 'static',
            resolve: {
                options: () => {
                    return {
                        title: options.title,
                        percent: options.percent
                    };
                }
            }
        };
        return <IProgressModalInstance>this.$modal.open(modalOptions);
    }
    /**
     * Show prompt dialog
     * @param options Prompt options
     */
    showPrompt(options: IPromptOptions): ng.IPromise<any> {
        const modalOptions: ng.ui.bootstrap.IModalSettings = {
            templateUrl: 'modalPromptDialog.tpl.html',
            controller: ['$scope', '$uibModalInstance', 'options',
                ($scope: IPromptScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IPromptOptions) => {
                    $scope.title = options.title || '';
                    $scope.subTitle = options.subTitle || '';
                    $scope.value = { val: options.initValue || '' };
                    $scope.okText = options.okText || this.localization.getLocal('rota.ok');
                    $scope.cancelText = options.cancelText || this.localization.getLocal('rota.cancel');
                    $scope.ok = () => { $modalInstance.close($scope.value.val); };
                    $scope.cancel = () => { $modalInstance.dismiss('cancel'); };
                }],
            keyboard: false,
            windowClass: "modal fade in",
            backdrop: 'static',
            resolve: {
                options: () => {
                    return {
                        title: options.title,
                        subTitle: options.subTitle,
                        initValue: options.initValue,
                        okText: options.okText,
                        cancelText: options.cancelText
                    };
                }
            }
        }; //Sonuc
        return this.$modal.open(modalOptions).result;
    }
    /**
     * Show file upload dialog
     * @param options FileUpload options
     */
    showFileUpload(options: IFileUploadOptions): ng.IPromise<any> {
        const modalOptions: ng.ui.bootstrap.IModalSettings = {
            templateUrl: 'modalFileUpload.tpl.html',
            controller: ['$scope', '$uibModalInstance', 'options',
                ($scope: IFileUploadScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IFileUploadOptions) => {
                    $scope.model = {};
                    $scope.allowedExtensions = options.allowedExtensions;
                    $scope.sendText = options.sendText || this.localization.getLocal('rota.gonder');
                    $scope.sendFile = () => {
                        $modalInstance.close($scope.model.file);
                    };
                    $scope.dismiss = () => {
                        $modalInstance.dismiss();
                    };
                }],
            keyboard: true,
            resolve: {
                options: () => {
                    return {
                        allowedExtensions: options.allowedExtensions
                    };
                }
            }
        };
        return this.$modal.open(modalOptions).result;
    }
    //#endregion
    /**
     * Show modal 
     * @param options Modal options
     */
    showModal<TModel extends IBaseModel, TResult extends {}>(options: IModalOptions<TModel>): ng.IPromise<TResult> {
        const templateFilePath = (this.common.isHtml(options.templateUrl) ?
            this.routeconfig.basePath : '') + options.templateUrl;
        //default options
        const defaultModalOptions: ng.ui.bootstrap.IModalSettings = {
            keyboard: false,
            backdrop: 'static',
            size: 'md',
            animation: false,
            bindToController: true,
            controllerAs: 'vm'
        }
        const modalOptions: ng.ui.bootstrap.IModalSettings = angular.extend(defaultModalOptions, options);
        //resolve data
        modalOptions.resolve = {
            instanceOptions: () => options.instanceOptions
        }
        //load controller file
        if (angular.isString(modalOptions.controller)) {
            const cntResolve = this.loader.resolve({ controllerUrl: options.controllerUrl, templateUrl: options.templateUrl });
            modalOptions.resolve = angular.extend(modalOptions.resolve, cntResolve);
        } else {
            if (!modalOptions.controller) {
                modalOptions.controller = Dialogs.defaultModalControllerName;
            }
        }
        return this.$modal.open(modalOptions).result;
    }
}

//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.services.dialog', ['ui.bootstrap']);
module.service('Dialogs', Dialogs);
module.run([
    '$templateCache', ($templateCache: ng.ITemplateCacheService) => {
        //#region Add templates to cache
        $templateCache.put('modalSimpleDialog.tpl.html',
            '<div class="rota-modal">' +
            '    <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
            '        <h4><i class="fa fa-question-circle"></i>&nbsp;{{title}}</h4>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '        <p>{{message}}</p>' +
            '    </div>' +
            '    <div class="modal-footer">' +
            '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
            '    </div>' +
            '</div>');
        //Template olarak cache'de sakla
        $templateCache.put('modalDialog.tpl.html',
            '<div class="rota-modal">' +
            '    <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
            '        <h4><i class="fa fa-question-circle"></i>&nbsp;{{title}}</h4>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '        <p>{{message}}</p>' +
            '    </div>' +
            '    <div class="modal-footer">' +
            '        <button class="btn btn-default" data-ng-click="cancel()">{{cancelText}}</button>' +
            '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
            '    </div>' +
            '</div>');
        //Template olarak cache'de sakla
        $templateCache.put('modalPromptDialog.tpl.html',
            '<div class="rota-modal">' +
            '    <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
            '        <h4><i class="fa fa-question-circle"></i>&nbsp;{{title}}</h4>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '           <div class="row">' +
            '               <div class="col-md-12">' +
            '                   <div class="form-group">' +
            '                       <label for="lblValue">{{subTitle}}</label>' +
            '                       <input id="lblValue" type="text" class="form-control" ng-model="value.val" autofocus/>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '    </div>' +
            '    <div class="modal-footer">' +
            '        <button class="btn btn-default" data-ng-click="cancel()">{{cancelText}}</button>' +
            '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
            '    </div>' +
            '</div>');
        //Please wait template'i cacheDe sakla
        $templateCache.put('modalProgress.tpl.html',
            '<div>' +
            '<div class="modal-body">' +
            '<h1>{{title}}</h1>' +
            '<div class="progress progress-sm progress-striped active">' +
            '<div class="progress-bar" role="progressbar" style="width: {{percent}}%"></div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
        //
        $templateCache.put('modalFileUpload.tpl.html',
            '<form class="form-horizontal" name="formUpload" ng-submit="sendFile()" novalidate>' +
            '<div class="modal-header">' +
            '       <h4><i class="fa fa-file"></i>&nbsp;{{::"bizwatch.yenidosya" | i18n}}</h4>' +
            '   </div>' +
            '   <div class="modal-body">' +
            '       <rt-file-upload ng-model="model.file" required accept="{{allowedExtensions}}"></rt-file-upload>' +
            '   </div>' +
            '   <div class="modal-footer">' +
            '       <button type="button" class="btn btn-info" data-ng-click="dismiss()" i18n="rota.iptal">' +
            '       </button><button type="submit" class="btn btn-success" ng-disabled="formUpload.$invalid">{{sendText}}</button>' +
            '   </div>' +
            '</form>');
        //#endregion
    }
]);


//#endregion

export {Dialogs}