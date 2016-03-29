import {ILanguage} from '../services/localization.interface';

interface IShellScope extends ng.IScope {
    currentLanguage: ILanguage;
    supportedLanguages?: ILanguage[];
    isCollapsed: boolean;

}

export {IShellScope}