import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions, ModelStates,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IKonteyner} from "./interfaces";


class BkgKonteynerController extends BaseCrudController<IKonteyner> {
    constructor(bundle: IBundle) {
        super(bundle, { newItemFieldName: 'konteynerId', formName: 'tasimaForm' });
    }

    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.common.promise();
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.common.promise();
    }

    newModel(): ng.IPromise<IKonteyner> {
        return this.common.promise<IKonteyner>({
            id: 0,
            prefix: 'yukno123',
            modelState: ModelStates.Added
        });
    }

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IKonteyner> {
        return this.common.promise<IKonteyner>(this.$stateParams.model);
    }
}

App.addController("bkgKonteynerController", BkgKonteynerController);