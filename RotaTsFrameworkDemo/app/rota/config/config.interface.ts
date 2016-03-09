//#region Imports
import { IBaseConfig, IBaseConfigProvider } from "../base/interfaces";
import {ILanguage} from '../services/localization.interface';

//#endregion

/**
 * Common event names used through the app
 */
interface IEvents {
    /**
     * Broadcast when login/logoff happened
     */
    userLoginChanged: string;
    /**
     * Fired unauthorized action taken or token expires
     */
    loginRequired: string;
    /**
     * Fired when http request begins
     */
    ajaxStarted: string;
    /**
     * Fired when http request ends
     */
    ajaxFinished: string;
    /**
     * Fired when menu changed programtically/manually
     */
    menuChanged: string;
}

/**
 * Main config settings
 */
interface IMainConfig extends IBaseConfig {
    /**
     * Api path used when there is only one api in use
     */
    defaultApiUrl?: string;
    /**
     * Application version number
     */
    appVersion?: string;
    /**
     * App title
     */
    appTitle?: string;
    /**
     * Indicates that app is running in debug mode
     */
    debugMode?: boolean;
    /**
     * Common event names
     */
    eventNames?: IEvents;
    /**
     * Default grid page size
     */
    gridDefaultPageSize?: number;
    /**
     * Default grid options scope name
     */
    gridDefaultOptionsName?: string;
    /**
     * Supported languages
     * @description if new lang is added,nls folder must be updaded accordingly in resource 
     */
    supportedLanguages?: ILanguage[];
    /**
     * Flag that indicates modelState property is assigned to model for crud operations
     */
    setModelStateForEntityFramework?: boolean;
    /**
     * Exception will be logged to Elmah db
     */
    serverExceptionLoggingEnabled?: boolean;

    serverExceptionLoggingBackendUrl?: string;
}
/**
 * Main config provider
 */
interface IMainConfigProvider extends IBaseConfigProvider<IMainConfig> {
}

export {IMainConfig, IMainConfigProvider}