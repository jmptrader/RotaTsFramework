import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType, ModelStates} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IBooking, IKonteyner} from "./interfaces";

class BkgGenelBilgilerController extends BaseCrudController<IBooking> {
    constructor(bundle: IBundle) {
        super(bundle);
    }

    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.common.promise();
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.common.promise();
    }
   

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IKonteyner> {
        return this.common.promise();
    }
}

App.addController("bkgGenelBilgilerController", BkgGenelBilgilerController);

