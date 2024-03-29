﻿import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseFormModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoController extends BaseCrudController<ITodoModel> {
    todoApi: ITodoApi;
    selectdata: Array<{ id: number, adi: string }>;
    selectvalue:number;

    constructor(bundle: IBundle) {
        super(bundle);

        this.selectdata = [{ id: 1, adi: "sercan" }, { id: 2, adi: "veli" }, { id: 3, adi: "ali" }];

        //this.addValidation({ func: this.checkDay, crudFlag: CrudType.Update, order: 1 });
        this.selectvalue = 2;
    }

    checkDay(): ng.IPromise<any> {
        return this.common.rejectedPromise<IValidationResult>(
            { message: 'Hata vartrrrrrrr' });
    }

    saveModel(options: ISaveOptions): ng.IPromise<ICrudServerResponse> {
        return this.todoApi.save(<ITodoModel>options.model);
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.todoApi.deleteById(options.key);
    }

    afterDeleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.routing.go('shell.content.todos');
    }

    getModel(modelFilter: IBaseFormModelFilter): ng.IPromise<ITodoModel> {
        var s = this.todoApi.getTodoById(modelFilter.id);
        return s;
    }
}

App.addController("todoController", TodoController, "todoApi");