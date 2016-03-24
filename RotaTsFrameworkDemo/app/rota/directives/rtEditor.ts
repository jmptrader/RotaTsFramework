//#region rtEditor
function editorDirective() {
    const directive = <ng.IDirective>{
        restrict: 'EA',
        require: 'ngModel',
        template: '<wysiwyg textarea-class="form-control rt-editor" textarea-required="ngRequired" disabled="ngDisabled" ng-model="ngModel"' +
        'enable-bootstrap-title="false"></wysiwyg>',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            ngRequired: '=?'
        }
    };
    return directive;
}

//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.directives.rteditor', []);
module.directive('rtEditor', editorDirective);
//#endregion
