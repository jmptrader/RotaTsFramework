//#region Imports
import {IMainConfig} from '../config/config.interface';
import {ICommon} from '../services/common.interface';
//#endregion

//#region Interfaces
/**
 * Datetime attributes
 */
export interface IDateTimeDirectiveAttrs extends ng.IAttributes {
    showTime: boolean;
}
/**
 * Datetime scope
 */
interface IDatetimeScope extends ng.IScope {
    openPicker: ($event: ng.IAngularEvent) => void;
    openIt: boolean;
    onTimeSet: (newValue: Date, oldValue: Date) => void;
    onSelected: (date: any) => void;
    ngDisabled: any;
}
//#endregion

//#region Ui-DateTime wrapper
function dateTimePickerDirective(config: IMainConfig, common: ICommon) {
    function compile(cElement: ng.IAugmentedJQuery, cAttrs: IDateTimeDirectiveAttrs) {
        //#region DOM manupulations
        const $input = $('input', cElement),
            $datetimepicker = $('datetimepicker', cElement),
            isShowTime = common.isDefined(cAttrs.showTime);
        $datetimepicker.attr('data-datetimepicker-config', '{startView:\'day\',minView:\'' + (isShowTime ? 'minute' : 'day') + '\'}');
        $input.attr('data-date-time-input', isShowTime ? config.datetimeFormat.timeFormat : config.datetimeFormat.dateFormat);
        //#endregion

        return (scope: IDatetimeScope, element: ng.IAugmentedJQuery, attrs: IDateTimeDirectiveAttrs, modelCtrl: ng.INgModelController): void => {
            //open
            scope.openPicker = ($event: ng.IAngularEvent): void => {
                common.preventClick($event);
                if (scope.ngDisabled) return;
                scope.openIt = true;
            }
            //close
            scope.onTimeSet = (newDate) => {
                scope.openIt = false;
                if (common.isAssigned(scope.onSelected)) {
                    scope.onSelected({ date: newDate });
                }
            };

            //clear value
            $(element).bind('keydown', (e: JQueryEventObject) => {
                switch (e.which) {
                    case 27:
                        scope.$apply(() => {
                            modelCtrl.$setViewValue(null);
                            common.preventClick(e);
                        });
                        break;
                }
            });
        }
    }
    //#region Directive Definition
    const directive = <ng.IDirective>{
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        compile: compile,
        scope: {
            ngModel: '=',
            ngRequired: '=',
            ngDisabled: '=',
            onSelected: '&?',
            onBeforeRender: '&?'
        },
        template: '<span class="rt-datepicker" uib-dropdown is-open="openIt">' +
        '<div class="input-group">' +
        '<input ng-disabled=ngDisabled ng-model-options="{debounce:50}" ng-required="ngRequired" ' +
        'data-date-parse-strict="false" ng-model=ngModel type="text" class="form-control"> ' +
        '<span style="cursor:pointer;" ng-click="openPicker($event)" class="input-group-addon">' +
        '<i class="fa fa-calendar"></i></span></div>' +
        '<ul uib-dropdown-menu role="menu" aria-labelledby="dLabel">' +
        '<datetimepicker ng-model=ngModel data-on-set-time=onTimeSet(newDate)/></ul></span>'
    };
    return directive;
    //#endregion
}
//#region Injections
dateTimePickerDirective.$inject = ['Config', 'Common'];
//#endregion
//#endregion

//#region Register
const module: ng.IModule = angular.module('rota.directives.rtdatepicker', []);
module.directive('rtDatePicker', dateTimePickerDirective).run([
    '$templateCache', ($templateCache: ng.ITemplateCacheService): void => {
        $templateCache.put('templates/datetimepicker.html', '<div class="datetimepicker table-responsive">\n    <table class="table table-condensed {{ data.currentView }}-view">\n        <thead>\n        <tr>\n            <th class="left" data-ng-click="changeView(data.currentView, data.leftDate, $event)" data-ng-show="data.leftDate.selectable"><i class="glyphicon glyphicon-arrow-left"><span class="sr-only">{{ screenReader.previous }}</span></i>\n            </th>\n            <th class="switch" colspan="5" data-ng-show="data.previousViewDate.selectable" data-ng-click="changeView(data.previousView, data.previousViewDate, $event)">{{ data.previousViewDate.display }}</th>\n            <th class="right" data-ng-click="changeView(data.currentView, data.rightDate, $event)" data-ng-show="data.rightDate.selectable"><i class="glyphicon glyphicon-arrow-right"><span class="sr-only">{{ screenReader.next }}</span></i>\n            </th>\n        </tr>\n        <tr>\n            <th class="dow" data-ng-repeat="day in data.dayNames">{{ day }}</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr data-ng-if="data.currentView !== \'day\'">\n            <td colspan="7">\n                          <span class="{{ data.currentView }}" data-ng-repeat="dateObject in data.dates" data-ng-class="{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: !dateObject.selectable}" data-ng-click="changeView(data.nextView, dateObject, $event)">{{ dateObject.display }}</span></td>\n        </tr>\n        <tr data-ng-if="data.currentView === \'day\'" data-ng-repeat="week in data.weeks">\n            <td data-ng-repeat="dateObject in week.dates" data-ng-click="changeView(data.nextView, dateObject, $event)" class="day" data-ng-class="{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: !dateObject.selectable}">{{ dateObject.display }}</td>\n        </tr>\n        </tbody>\n    </table>\n</div>');
    }
]);
//#endregion
