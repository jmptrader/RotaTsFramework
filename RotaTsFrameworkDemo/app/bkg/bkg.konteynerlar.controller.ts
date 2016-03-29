import {App} from "app/rota/config/app";
import {BaseModelController} from "app/rota/base/basemodelcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IBooking} from "./interfaces";


class BkgKonteynerlarController extends BaseModelController<IBooking> {
    constructor(bundle: IBundle) {
        super(bundle);

    }

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBooking> {
        return this.common.promise();
    }
}

App.addController("bkgKonteynerlarController", BkgKonteynerlarController);