﻿import {App} from "app/rota/config/app";
import {IBundle, IGridOptions} from 'app/rota/base/interfaces';
import {ITodoModel, ITodoFilter} from "./todos.models";
import {ITodoApi} from "./todos.service";
//deps
import {BaseListController} from "app/rota/base/baselistcontroller";
import "./todos.service";

enum MusteriTipi {
    Tuzel,
    Sahis
}

class TodosController extends BaseListController<ITodoModel, ITodoFilter> {

    todoApi: ITodoApi;
    selectvalue: number;
    pp: number;
    musteriler: ng.IPromise<ITodoModel[]>;
    selected: any[];
    musteriTip:any;

    constructor(bundle: IBundle) {
        super(bundle, { editState: "shell.content.todo", pagingEnabled: false });

        this.selectvalue = 5;
        this.pp = 4;
        this.selected = [{ bagOlgKullId: 3 }, { bagOlgKullId: 1 }];

        this.musteriler = this.todoApi.getTodos();
        this.musteriTip = this.common.convertEnumToArray(MusteriTipi);
    }

    getModel(modelFilter: ITodoFilter): ng.IPromise<ITodoModel[]> {
        return this.todoApi.getTodos(modelFilter);
    }

    dataArrived(data: any) {
    }

    getMusteriById(id: number): ng.IPromise<ITodoModel> {
        return this.todoApi.getTodoById(id);
    }

    getMusteriler(params: any): ng.IPromise<ITodoModel[]> {
        return this.todoApi.getTodos();
    }


    getMusterilerByKeyword(keyword: string): ng.IPromise<ITodoModel[]> {
        return this.todoApi.getTodos({ Text: keyword });
    }

    getGridColumns(options: IGridOptions): uiGrid.IColumnDef[] {
        return [{
            displayName: 'Text',
            width: '*',
            field: "text"
        }
        ];
    }

    deleteModel(id: number | number[]): ng.IPromise<any> {
        if (this.common.isArray(id)) {
            const qAll: ng.IPromise<any>[] = [];
            id.forEach((key) => {
                qAll.push(this.todoApi.deleteById(key));
            });
            return this.$q.all(qAll);
        }
        return this.todoApi.deleteById(<number>id);
    }

    openModal(): ng.IPromise<any> {
        const modalResult = this.dialogs.showModal({
            templateUrl: 'app/todo/todo.modal.html'
        });

        modalResult.then((model: ITodoModel) => {
            this.gridData.push(model);
        });

        return modalResult;
    }
}

App.addController("todosController", TodosController, "todoApi");