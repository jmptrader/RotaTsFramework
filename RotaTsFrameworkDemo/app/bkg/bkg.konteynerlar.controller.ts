import {App} from "app/rota/config/app";
import {BaseModelController} from "app/rota/base/basemodelcontroller";
import {IBundle, IBaseFormModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType, IBaseListModel, IGridOptions, ModelStates} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {IKonteyner} from "./interfaces";
import {IBkgService} from "./bkg.service";
import "./bkg.service";


class BkgKonteynerlarController extends BaseModelController<IKonteyner> {
    BkgService: IBkgService;
    konteynerGridOptions: IGridOptions;
    constructor(bundle: IBundle) {
        super(bundle, { initializeModel: true });

        this.konteynerGridOptions = {
            columnDefs: [
                {
                    field: 'id'
                },
                {
                displayName: 'Konteyner No',
                width: '*',
                field: "prefix"
            }, {
                    field: 'modelState'
                },

                {
                    name: 'editBNutton',
                    cellClass: 'col-align-center',
                    width: '30',
                    displayName: '',
                    enableColumnMenu: false,
                    cellTemplate: '<a class="btn btn-default btn-xs" ng-click="grid.appScope.vm.goTasimaDetay(row.entity[\'id\'])"' +
                    ' uib-tooltip=\'Detay\' tooltip-placement="top"><i class="fa fa-edit"></i></a>'
                }
            ]
        }
    }

    goTasimaDetay(id: number) {
        this.routing.go('shell.content.bkg.konteynerler.new', { konteynerId: id });
    }

    loadedModel(model: IKonteyner[]): void {
        this.konteynerGridOptions.data = model;
    }

    getModel(modelFilter: IBaseFormModelFilter): IBaseListModel<IKonteyner> {
        return this.BkgService.bkgModel.konteynerlar;
    }
}

App.addController("bkgKonteynerlarController", BkgKonteynerlarController, "BkgService");