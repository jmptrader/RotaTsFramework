import { IBaseConfig } from "../base/interfaces";
import {ILanguage} from '../services/localization.interface';

interface IEvents {
    userLoginChanged: string;
    loginRequired: string;
    ajaxStarted: string;
    ajaxFinished: string;
    menuChanged: string;
    badgeChanged: string;
}

interface IMainConfig extends IBaseConfig {
    defaultApiUrl?: string;
    appVersion?: string;
    appTitle?: string;
    debugMode?: boolean;
    eventNames?: IEvents;
    gridDefaultPageSize?: number;
    gridDefaultOptionsName?: string;
    supportedLanguages?: ILanguage[];
}

export {IMainConfig}