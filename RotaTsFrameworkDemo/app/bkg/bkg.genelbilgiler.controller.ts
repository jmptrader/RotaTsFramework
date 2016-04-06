import {App} from "app/rota/config/app";
import {BaseFormController} from "app/rota/base/baseformcontroller";
import {IBundle, IBaseFormModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType, ModelStates} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';


import {IBooking, IKonteyner} from "./interfaces";
import {IBkgService} from "./bkg.service";
import "./bkg.service";


class BkgGenelBilgilerController extends BaseFormController<IBooking> {
    BkgService: IBkgService;
    constructor(bundle: IBundle) {
        super(bundle);
    }

    getModel(modelFilter: IBaseFormModelFilter): IBooking {
        return this.BkgService.bkgModel;
    }
}

App.addController("bkgGenelBilgilerController", BkgGenelBilgilerController, "BkgService");

