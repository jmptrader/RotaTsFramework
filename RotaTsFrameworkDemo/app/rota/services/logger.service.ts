//#region Imports
import {IToastr, INotification, INotify, ILog, IBaseLogger, ILoggerConfig, ILogger, IConsole} from './logger.interface';
import {IMainConfig} from '../config/config.interface';
import {IBaseConfigProvider} from "../base/interfaces";
import {ILocalization} from './localization.interface';
//deps
import {Localization} from './localization.service';
import "./logger.config";
import * as toastr from "toastr";
import * as moment from "moment";
import * as angular from "angular";
//#endregion

//#region Enums
export enum LogType {
    Info,
    Error,
    Warn,
    Success,
    Debug
}

export enum LogServices {
    Console = 1,
    Toastr = 2,
    Notification = 4
}

export enum NotifyType {
    Sticky,
    RouteCurrent,
    RouteNext
}
//#endregion

//#region Log Services
/**
 * Toast notification based on //John Papa toastr - https://github.com/CodeSeven/toastr
 */
class Toastr implements IToastr {
    constructor(private loggerconfig: ILoggerConfig) {
    }
    /**
     * Toast log message
     * @param toast Log
     */
    log(toast: ILog): void {
        toastr.options.timeOut = this.loggerconfig.timeOuts[LogType.Debug];
        this.info(toast);
    }
    /**
     * Toast error message
     * @param toast Log
     */
    error(toast: ILog): void {
        toastr.options.timeOut = this.loggerconfig.timeOuts[LogType.Error];
        toastr.error(toast.message, toast.title || this.loggerconfig.defaultTitles[LogType.Error]);
    }
    /**
     * Toast warn message
     * @param toast Log
     */
    warn(toast: ILog): void {
        toastr.options.timeOut = this.loggerconfig.timeOuts[LogType.Warn];
        toastr.warning(toast.message, toast.title || this.loggerconfig.defaultTitles[LogType.Warn]);
    }
    /**
     * Toast success message
     * @param toast Log
     */
    success(toast: ILog): void {
        toastr.options.timeOut = this.loggerconfig.timeOuts[LogType.Success];
        toastr.success(toast.message, toast.title || this.loggerconfig.defaultTitles[LogType.Success]);
    }
    /**
     * Toast info message
     * @param toast Log
     */
    info(toast: ILog): void {
        toastr.options.timeOut = this.loggerconfig.timeOuts[LogType.Info];
        toastr.info(toast.message, toast.title || this.loggerconfig.defaultTitles[LogType.Info]);
    }
}
/**
 * Notification service works with notification.html in shell folder
 */
class Notification implements INotification {
    /**
     * All notifications
     */
    private notifications: { [index: number]: INotify[] };
    /**
     * Current notifications
     * @returns {} 
     */
    get currentNotifications(): INotify[] {
        return new Array<INotify>().concat(this.notifications[NotifyType.Sticky], this.notifications[NotifyType.RouteCurrent]);
    }

    constructor(private loggerconfig: ILoggerConfig) {
        this.notifications = {};
        this.notifications[NotifyType.Sticky] = [];
        this.notifications[NotifyType.RouteCurrent] = [];
        this.notifications[NotifyType.RouteNext] = [];
    }
    /**
     * Notify log message
     * @param notify Notify message
     */
    log(notify: ILog): void {
        this.info(notify);
    }
    /**
     * Notify info message
     * @param notify Notify message
     */
    info(notify: ILog): INotify {
        return this.addNotification({
            title: notify.title || this.loggerconfig.defaultTitles[LogType.Info],
            message: notify.message,
            icon: 'info',
            style: 'info'
        }, NotifyType.RouteCurrent);
    }
    /**
     * Notify error message
     * @param notify Notify message
     */
    error(notify: ILog): INotify {
        return this.addNotification({
            title: notify.title || this.loggerconfig.defaultTitles[LogType.Error],
            message: notify.message,
            icon: 'times',
            style: 'danger'
        }, NotifyType.Sticky);
    }
    /**
     * Notify warn message
     * @param notify Notify message
     */
    warn(notify: ILog): INotify {
        return this.addNotification({
            title: notify.title || this.loggerconfig.defaultTitles[LogType.Warn],
            message: notify.message,
            icon: 'warning',
            style: 'warning'
        }, NotifyType.RouteCurrent);
    }
    /**
     * Notify success message
     * @param notify Notify message
     */
    success(notify: ILog): INotify {
        return this.addNotification({
            title: notify.title || this.loggerconfig.defaultTitles[LogType.Success],
            message: notify.message,
            icon: 'check-square-o',
            style: 'success'
        }, NotifyType.RouteCurrent);
    }
    /**
     * Add notification
     * @param notify Notify object
     * @param notifyType Notify Type
     */
    private addNotification(notify: INotify, notifyType: NotifyType = NotifyType.RouteCurrent): INotify {
        //TODO:sce sanitize message and text ?
        this.notifications[notifyType].push(notify);
        return notify;
    }
    /**
     * Remove notification
     * @param notify Notify
     */
    removeNotification(notify: INotify): void {
        for (let i = NotifyType.Sticky; i <= NotifyType.RouteNext; i++) {
            const notificationsByType = this.notifications[i];
            const idx = notificationsByType.indexOf(notify);
            if (idx > -1) {
                notificationsByType.splice(idx, 1);
            }
        }
    }
    /**
     * Remove all registered notifications
     * @param includeSticky Include sticky flag
     */
    removeAll(includeSticky: boolean): void {
        this.notifications[NotifyType.RouteCurrent].length = 0;
        this.notifications[NotifyType.RouteNext].length = 0;
        //Include sticky norifications
        if (includeSticky) {
            this.notifications[NotifyType.Sticky].length = 0;
        }
    }
}
/**
 * Console logger for either debugging and exceptions
 */
class Console implements IConsole {
    constructor(private $log: ng.ILogService, private config: IMainConfig) {
    }
    /**
     * Format log with timestamp
     * @param log Log
     */
    private formatLog(log: ILog): string {
        return `${moment().format('H:mm:ss SSS')} - ${log.message}`;
    }
    /**
     * Log generic method only works on debug mode
     * @param type Log type
     * @param args Args
     */
    private logit(type: string, ...args: any[]): void {
        if (this.config.debugMode) {
            this.$log[type](args);
        }
    }
    /**
     * Log 
     * @param log Log
     */
    log(log: ILog): void {
        this.logit('log', this.formatLog(log), log.data);
    }
    /**
     * Info
     * @param log Log
     */
    info(log: ILog): void {
        this.logit('info', this.formatLog(log), log.data);
    }
    /**
     * Error
     * @param log Log
     */
    error(log: ILog): void {
        this.logit('error', this.formatLog(log), log.data);
    }
    /**
     * Warning
     * @param log Log
     */
    warn(log: ILog): void {
        this.logit('warn', this.formatLog(log), log.data);
    }
    /**
     * Success
     * @param log Log
     */
    success(log: ILog): void {
        this.logit('info', this.formatLog(log), log.data);
    }
    /**
     * Used for logs u think its important 
     * @param message Message
     */
    important(message: string): void {
        this.logit('log', '%c %s %s %s ', 'color: white; background-color: #57889c;', '--', message, '--');
    }
    /**
     * Used for timing measurements,starts times
     * @param message Message
     * @param timerName Timer name
     */
    startTime(message: string, timerName: string): void {
        if (!this.config.debugMode) return;
        this.logit('log', '%c%s %s %s', 'color: brown; font-weight: bold; text-decoration: underline;', '--', message, '--');
        //Start timer
        if (console.time) {
            console.time(timerName);
        } else {
            this.logit('error', 'console.time not supported');
        }
    }
    /**
     * Used for timing measurements,ends times
     * @param message Message
     * @param timerName Timer name
     */
    endTime(message: string, timerName: string): void {
        if (!this.config.debugMode) return;
        this.logit('log', '%c%s %s %s', 'color: brown; font-weight: bold; text-decoration: underline;', '--', message, '--');
        //Start timer
        if (console.timeEnd) {
            console.timeEnd(timerName);
        } else {
            this.logit('error', 'console.timeEnd not supported');
        }
    }
}

//#endregion

//#region Logger Service
/**
 * Logger Service
 */
class Logger implements ILogger {
    //#region Props
    serviceName = "Logger Service";
    private logServices: { [index: number]: IBaseLogger };
    //Services
    /**
     * Console Service
     * @returns {} Console Service
     */
    get console(): IBaseLogger { return this.logServices[LogServices.Console]; }
    /**
     * Notification Service
     * @returns {} Notification Service
     */
    get notification(): IBaseLogger { return this.logServices[LogServices.Notification]; }
    /**
     * Toastr service
     * @returns {} Toastr service
     */
    get toastr(): IBaseLogger { return this.logServices[LogServices.Toastr]; }
    //#endregion
    static $inject = ['$log', 'Config', 'LoggerConfig', 'Localization'];
    constructor($log: ng.ILogService, config: IMainConfig, loggerconfig: ILoggerConfig, localization: ILocalization) {
        loggerconfig.defaultTitles[LogType.Info] = localization.getLocal('rota.titleinfo');
        loggerconfig.defaultTitles[LogType.Warn] = localization.getLocal('rota.titlewarn');
        loggerconfig.defaultTitles[LogType.Success] = localization.getLocal('rota.titlesuccess');
        loggerconfig.defaultTitles[LogType.Error] = localization.getLocal('rota.titleerror');
        loggerconfig.defaultTitles[LogType.Debug] = localization.getLocal('rota.titledebug');
        //Register services
        this.logServices = {};
        this.logServices[LogServices.Console] = new Console($log, config);
        this.logServices[LogServices.Notification] = new Notification(loggerconfig);
        this.logServices[LogServices.Toastr] = new Toastr(loggerconfig);
    }
}

//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.services.log', ['rota.services.log.config']);
module.service('Logger', Logger);
//Config 
module.config([
    '$logProvider', 'LoggerConfigProvider',
    ($logProvider: ng.ILogProvider, loggerConfigProvider: IBaseConfigProvider<ILoggerConfig>) => {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(loggerConfigProvider.config.debugEnabled);
        }
    }
]);
//#endregion

export {Logger}