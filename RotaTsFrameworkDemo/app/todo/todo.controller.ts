﻿import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IDeleteOptions,
    IValidationItem, IValidationResult, CrudType} from 'app/rota/base/interfaces';
import {IServerResponse} from 'app/rota/services/common.interface';

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoController extends BaseCrudController<ITodoModel> {
    todoApi: ITodoApi;

    constructor(bundle: IBundle) {
        super(bundle);

       
        this.addValidation({ func: this.checkDay, crudFlag: CrudType.Update });
    }

    checkDay(): ng.IPromise<any> {
        return this.common.rejectedPromise<IValidationResult>(
            { messageI18N: 'todo.state' });
    }

    saveModel(options: ISaveOptions): ng.IPromise<IServerResponse> {
        return this.todoApi.save(<ITodoModel>options.model);
    }

    deleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.todoApi.deleteById(options.key);
    }

    afterDeleteModel(options: IDeleteOptions): ng.IPromise<any> {
        return this.routing.go('shell.content.todos');
    }

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<ITodoModel> {
        return this.todoApi.getTodoById(modelFilter.id);
    }
}

App.addController("todoController", TodoController, "todoApi");