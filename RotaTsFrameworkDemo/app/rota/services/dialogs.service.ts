//#region Imports
import {IRotaRootScope} from './common.interface';
import {IRouting} from './routing.interface';
import {IMainConfig} from '../config/config';
import {ICommon} from './common.interface';
import {ILoader} from './loader.interface';
import {IRouteConfig} from './routing.interface';
import {IDialogOptions, IDialogScope, IConfirmOptions, IConfirmScope,
IProgressOptions, IProgressScope, IProgressModalInstance, IPromptOptions,
IPromptScope, IFileUploadOptions, IFileUploadScope, IModalOptions, IDialogs} from './dialogs.interface';
//static
import "angular"
import "angular-bootstrap"
//#endregion

/**
 * Dialog service
 */
class Dialogs implements IDialogs {
    serviceName = 'Dialog Service';

    static $inject = ['$rootScope', '$q', '$modal', '$templateCache', 'Routing', 'Config', 'RouteConfig', 'Common', 'Loader'];
    constructor(private $rootScope: IRotaRootScope,
        private $q: ng.IQService,
        private $modal: ng.ui.bootstrap.IModalService,
        private $templateCache: ng.ITemplateCacheService,
        private routing: IRouting,
        private config: IMainConfig,
        private routeconfig: IRouteConfig,
        private common: ICommon,
        private loader: ILoader) {
        //init
        this.initTemplates();
    }

    //#region Dialogs
    /**
     * Show simple dialog with ok button
     * @param options Dialog options
     */
    showDialog(options: IDialogOptions): ng.IPromise<any> {
        const modalOptions: ng.ui.bootstrap.IModalSettings = {
            templateUrl: 'modalSimpleDialog.tpl.html',
            controller: ['$scope', '$modalInstance', 'options',
                ($scope: IDialogScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IDialogOptions) => {
                    $scope.title = options.title || 'Onay';//self.localization.get('rota.onay');
                    $scope.message = options.message || '';
                    $scope.okText = options.okText || 'Tamam';//self.localization.get('rota.ok');
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
            controller: ['$scope', '$modalInstance', 'options',
                ($scope: IConfirmScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IConfirmOptions) => {
                    $scope.title = options.title || 'Onay';//this.localization.get('rota.onay');
                    $scope.message = options.message || '';
                    $scope.okText = options.okText || 'Tamam';//this.localization.get('rota.ok');
                    $scope.cancelText = options.cancelText || 'İptal';//this.localization.get('rota.iptal');
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
            controller: ['$scope', '$timeout', '$modalInstance', 'options',
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
                    $scope.title = options.title || 'lutfenbekleyiniz'; //self.localization.get('rota.lutfenbekleyiniz');
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
            controller: ['$scope', '$modalInstance', 'options',
                ($scope: IPromptScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IPromptOptions) => {
                    $scope.title = options.title || '';
                    $scope.subTitle = options.subTitle || '';
                    $scope.value = { val: options.initValue || '' };
                    $scope.okText = options.okText || 'Tamam';//this.localization.get('rota.ok');
                    $scope.cancelText = options.cancelText || 'İptal';//this.localization.get('rota.cancel');
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
            controller: ['$scope', '$modalInstance', 'options',
                ($scope: IFileUploadScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, options: IFileUploadOptions) => {
                    $scope.model = {};
                    $scope.allowedExtensions = options.allowedExtensions;
                    $scope.sendText = options.sendText || 'Gonder';//this.localization.get('rota.gonder');
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
    showModal(options: IModalOptions): ng.IPromise<any> {
        const templateFilePath = (this.common.isHtml(<string>options.templateUrl) ?
            this.routeconfig.basePath : '') + options.templateUrl;
        //default options
        const defaultModalOptions: ng.ui.bootstrap.IModalSettings = {
            keyboard: false,
            backdrop: 'static',
            size: 'md',
            animation: false
        }
        const modalOptions: ng.ui.bootstrap.IModalSettings = angular.extend(defaultModalOptions, options); 
        //resolve data
        modalOptions.resolve = {
            modalParams: () => options.param
        }
        //load controller file
        if (angular.isString(modalOptions.controller)) {
            const cntResolve = this.loader.resolve({ controllerUrl: options.controllerUrl, templateUrl: templateFilePath });
            modalOptions.resolve = angular.extend(modalOptions.resolve, cntResolve);
        }
        return this.$modal.open(modalOptions).result;
    }
    /**
     * Init modal templates into templatecache
     */
    initTemplates() {
        //Template olarak cache'de sakla
        this.$templateCache.put('modalSimpleDialog.tpl.html',
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
        this.$templateCache.put('modalDialog.tpl.html',
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
        this.$templateCache.put('modalPromptDialog.tpl.html',
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
        this.$templateCache.put('modalProgress.tpl.html',
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
        this.$templateCache.put('modalFileUpload.tpl.html',
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
    }
}

//#region Register
var module: ng.IModule = angular.module('rota.misc.dialog', ['ui.bootstrap']);
module.service('Dialogs', Dialogs);
//#endregion

export {Dialogs, IDialogs}