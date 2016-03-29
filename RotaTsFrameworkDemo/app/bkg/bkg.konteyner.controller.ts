import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IBooking} from "./interfaces";


class BkgKonteynerController extends BaseCrudController<IBooking> {
    constructor(bundle: IBundle) {
        super(bundle);

    }



    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.common.promise();
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.common.promise();
    }


    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBooking> {
        return this.common.promise();
    }
}

App.addController("bkgKonteynerController", BkgKonteynerController);