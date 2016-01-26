import { IBaseConfig} from "../base/baseconfig";
import { IBaseService} from "./service.interface";

interface ILoaderConfig extends IBaseConfig {
    useTemplateUrlPath: boolean;
    useBaseUrl: boolean;
}

interface ILoaderSettings {
    controllerUrl?: string;
    templateUrl?: string;
    useTemplateUrlPath?: boolean;
    useBaseUrl?: boolean;
}

interface ILoader extends IBaseService {
    resolve(settings: ILoaderSettings): { [index: string]: any[] };
}

export {ILoaderConfig, ILoader, ILoaderSettings}