import {App} from "app/rota/config/app";
import {BaseModelController} from "app/rota/base/basemodelcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IBooking} from "./interfaces";


interface IBkgParams extends ng.ui.IStateParamsService {
    model: IBooking;
}



class BkgGenelBilgilerController extends BaseModelController<IBooking> {
    constructor(bundle: IBundle) {
        debugger;
        super(bundle);
    }


    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBooking> {
        return this.common.promise<IBooking>({
            id: 2,
            bkgNo: "dwqwddq",
            tasimalar: []
        });
    }
}


//App.controllerProvider.register('bkgGenelBilgilerController', BkgGenelBilgilerController);
App.addController("bkgGenelBilgilerController", BkgGenelBilgilerController);

//class BkgGenelBilgilerController extends BaseController {
//    protected $stateParams: IBkgParams;
//    constructor(bundle: IBundle) {
//        super(bundle);
//        //this.initModel();

//    }

//    //loadedModel(model: IBooking): void {
//    //    this.$stateParams.model = model;
//    //}

//    //getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBooking> {
//    //    return this.common.promise<IBooking>({
//    //        id: 2,
//    //        bkgNo: "dwqwddq",
//    //        tasimalar: []
//    //    });
//    //}
//}

//App.addController("bkgGenelBilgilerController", BkgGenelBilgilerController);