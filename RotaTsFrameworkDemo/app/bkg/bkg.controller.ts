import {App} from "app/rota/config/app";
import {CrudController} from "app/rota/base/crudcontroller";
import {IBundle, IBaseFormModelFilter, ISaveOptions, IDeleteOptions, ModelStates,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {ITab} from "app/rota/directives/rtTabs";

import {IBooking} from "./interfaces";
import {IBkgService} from './bkg.service';



class BkgController extends CrudController<IBooking> {
    mytabs: ITab[];
    BkgService: IBkgService;

    constructor(bundle: IBundle) {
        super(bundle);

        this.mytabs = [
            {
                state: 'shell.content.bkg.genelbilgiler'
            }, {
                state: 'shell.content.bkg.konteynerler.liste',
                activeState: 'shell.content.bkg.konteynerler'
            }];
    }

    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.common.promise();
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.common.promise();
    }

    getModel(modelFilter: IBaseFormModelFilter): IBooking {
        return this.BkgService.bkgModel;
    }
}

App.addController("bkgController", BkgController, 'BkgService');

