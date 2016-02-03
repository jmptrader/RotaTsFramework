import { IBaseService} from "./service.interface";

interface ILoggerConfig {
    debugEnabled: boolean;
    timeOuts: { [index: number]: number };
    defaultTitles: { [index: number]: string };
}
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

interface ILog {
    message: string;
    title?: string;
    data?: any;
}

interface INotify extends ILog {
    icon: string;
    style: string;
}

interface ILogCall {
    (log: ILog): void
}

interface IBaseLogger {
    log: ILogCall;
    info: ILogCall;
    error: ILogCall;
    warn: ILogCall;
    success: ILogCall;
}

interface IToastr extends IBaseLogger {
}

interface INotification extends IBaseLogger {
    currentNotifications: INotify[];
    removeNotification(notify: INotify): void;
    removeAll(includeSticky: boolean): void;
}

interface IConsole extends IBaseLogger {
    important(message: string): void;
    startTime(message: string, timerName: string): void;
    endTime(message: string, timerName: string): void;
}

interface ILogger extends IBaseService {
    notification: IBaseLogger;
    console: IBaseLogger;
    toastr: IBaseLogger;
}

export {IToastr, IBaseLogger, INotification, INotify, ILog, ILoggerConfig, ILogger, IConsole}