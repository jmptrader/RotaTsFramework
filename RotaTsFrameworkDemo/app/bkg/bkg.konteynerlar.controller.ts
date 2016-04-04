import {App} from "app/rota/config/app";
import {BaseListController} from "app/rota/base/baselistcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType, IBaseListModel, IGridOptions, ModelStates} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IKonteyner} from "./interfaces";


class BkgKonteynerlarController extends BaseListController<IKonteyner, {}> {
    constructor(bundle: IBundle) {
        super(bundle);

    }

    getGridColumns(options: IGridOptions): uiGrid.IColumnDef[] {
        return [{
            displayName: 'Konteyner No',
            width: '*',
            field: "prefix"
        }, {
                field: 'modelState'
            }
        ];
    }

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<IBaseListModel<IKonteyner>> {
        return this.common.promise<IKonteyner[]>([
            {
                id: 1,
                prefix: 'ARKU12345678',
                modelState: ModelStates.Unchanged
            },
            {
                id: 2,
                prefix: 'ARKU54458445',
                modelState: ModelStates.Unchanged
            },
            {
                id: 3,
                prefix: 'MSCU12345678',
                modelState: ModelStates.Unchanged
            }
        ]);
    }
}

App.addController("bkgKonteynerlarController", BkgKonteynerlarController);