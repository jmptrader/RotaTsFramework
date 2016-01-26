import {ILocalization} from "./localization.interface";
import "i18n!rota-resource/nls/resources";
import "i18n!resources/nls/resources";

class Localization implements ILocalization {
    serviceName = "Localization Service";
    
    static $inject = [];
    constructor() {
       
    }


}