import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions, ModelStates,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {ITab} from "app/rota/directives/rtTabs";

import {IBooking} from "./interfaces";

class BkgController extends BaseCrudController<IBooking> {

    mytabs: ITab[];

    constructor(bundle: IBundle) {
        debugger;
        super(bundle);

        this.mytabs = [
            {
                state: 'shell.content.bkg.genelbilgiler',
                heading: 'Genel Bilgiler',
                icon: 'check'
            }, {
                state: 'shell.content.bkg.konteynerler',
                heading: 'Konteynerlar',
                icon: 'cloud'
            }];

        this.routing.go('shell.content.bkg.genelbilgiler');
    }

    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.common.promise();
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.common.promise();
    }

    newModel(): IBooking {
        return {
            id: 0,
            tasimalar: [],
            modelState: ModelStates.Added
        }
    }

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBooking> {
        return undefined;
    }
}

//App.controllerProvider.register('bkgController', BkgController);
App.addController("bkgController", BkgController);

//class BkgController extends BaseController {

//    mytabs: ITab[];

//    constructor(bundle: IBundle) {
//        super(bundle);



//        this.mytabs = [
//            {
//                state: 'shell.content.bkg.genelbilgiler',
//                heading: 'Genel Bilgiler',
//                icon: 'check'
//            }, {
//                state: 'shell.content.bkg.konteynerler',
//                heading: 'Konteynerlar',
//                icon: 'cloud'
//            }];
//    }

//    //render(options): void {
//    //    debugger;
//    //}

//    //saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
//    //    return this.common.promise();
//    //}

//    //deleteModel(options: IDeleteOptions): ng.IPromise<any> {
//    //    return this.common.promise();
//    //}

//    //newModel(): IBooking {
//    //    return {
//    //        id: 0,
//    //        tasimalar: [],
//    //        modelState: ModelStates.Added
//    //    }
//    //}

//    //getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBooking> {
//    //    return undefined;
//    //}
//}

//App.addController("bkgController", BkgController);