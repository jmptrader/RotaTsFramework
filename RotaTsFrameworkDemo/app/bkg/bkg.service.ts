import { App } from "app/rota/config/app";
import { IBaseApi, BaseApi } from "app/rota/base/baseapi";
import {IBooking, IKonteyner}  from "./interfaces";
import {ICrudServerResponse} from 'app/rota/services/common.interface';
import {IBundle} from 'app/rota/base/interfaces';

import * as _ from "underscore";
import "./bkg.model"


interface IBkgService {
    bkgModel: IBooking;
    getBkg(): IBooking;
    getKonteynerlarByBkgId(bkgId: number): IKonteyner[];
    getKonteynerById(id: number): IKonteyner;
    saveKonteyner(kontyener: IKonteyner): ng.IPromise<ICrudServerResponse>;
}

class BkgService extends BaseApi implements IBkgService {
    bkgModel: IBooking;

    constructor(bundle: IBundle, bkgModel: IBooking) {
        super(bundle);
        this.bkgModel = bkgModel;
    }

    getBkg(): IBooking {
        return this.bkgModel;
    }
    getKonteynerlarByBkgId(bkgId: number): IKonteyner[] {
        return this.bkgModel.konteynerlar;
    }

    getKonteynerById(id: number): IKonteyner {
        return _.findWhere(this.bkgModel.konteynerlar, { id: id });
    }

    saveKonteyner(kontyener: IKonteyner): ng.IPromise<ICrudServerResponse> {
        const copy = angular.copy(kontyener);
        //copy.id = (_.max(this.bkgModel.konteynerlar, (item): number => {
        //    return item.id;
        //}).id || 0) + 1;
        this.bkgModel.konteynerlar.push(copy);
        return this.common.promise<ICrudServerResponse>({
            model: copy
        });
    }
}
//Register
App.addApi("BkgService", BkgService, ['bkg.model']);
//Export
export {BkgService, IBkgService}
