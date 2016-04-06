import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseFormModelFilter, ISaveOptions, IDeleteOptions, ModelStates,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IKonteyner} from "./interfaces";
import {IBkgService} from "./bkg.service";
import "./bkg.service";

class BkgKonteynerController extends BaseCrudController<IKonteyner> {
    BkgService: IBkgService;
    constructor(bundle: IBundle) {
        super(bundle, { newItemFieldName: 'konteynerId', formName: 'tasimaForm' });
    }

    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.BkgService.saveKonteyner(options.model as IKonteyner);
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.common.promise();
    }

    getModel(modelFilter: IBaseFormModelFilter): IKonteyner {
        return this.BkgService.getKonteynerById(modelFilter.id);
    }
}

App.addController("bkgKonteynerController", BkgKonteynerController, "BkgService");