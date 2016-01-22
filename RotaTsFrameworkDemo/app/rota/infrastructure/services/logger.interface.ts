import { IBaseService} from "./service.interface";

interface ILoggerConfig {
    debugEnabled: boolean;
    timeOuts: { [index: number]: number };
}
export enum LogType {
    Info,
    Error,
    Warn,
    Success,
    Debug
}

export enum LogPlace {
    Panel = 1,
    Toast = 2,
    Console = 4
}

export enum LogServices {
    Console,
    Toastr,
    Notification
}

export enum NotifyType {
    Sticky,
    RouteCurrent,
    RouteNext
}

interface ILog {
    message: string;
    title: string;
    data: any;
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
}

interface IConsole extends IBaseLogger {
}

interface ILogger extends IBaseLogger,IBaseService {

}

export {IToastr, IBaseLogger, INotification, INotify, ILog, ILoggerConfig, ILogger, IConsole}