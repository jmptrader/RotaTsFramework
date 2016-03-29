import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions, ModelStates,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IBooking} from "./interfaces";


class BkgController extends BaseCrudController<IBooking> {

    deneme: Date;

    constructor(bundle: IBundle) {
        super(bundle);

        this.model = { id: 1, bkgNo: "22", modelState: ModelStates.Added };
        this.deneme = new Date();
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

App.addController("bkgController", BkgController);