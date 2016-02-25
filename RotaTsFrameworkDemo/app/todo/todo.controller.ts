import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IServerResponse} from 'app/rota/base/interfaces';

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoController extends BaseCrudController<ITodoModel> {
    todoApi: ITodoApi;

    constructor(bundle: IBundle) {
        super(bundle);
    }

    saveModel(options: ISaveOptions): ng.IPromise<IServerResponse> {
       
        return this.todoApi.save(<ITodoModel>options.model);
    }
    afterSaveModel(options: ISaveOptions): ng.IPromise<any> {
        this.routing.go('shell.content.todos');
        return null;
    }




    //beforeSaveModel(options: ISaveOptions): ng.IPromise<any> {
    //    return this.common.rejectedPromise<IPipelineError>({ exception: { message: 'hatattata' } });
    //}

    deleteById(id: number): ng.IPromise<any> {
        return this.todoApi.deleteById(id).then(() => {
            //this.routing.goBack();
        });
    }

    getModel(modelFilter: IBaseCrudModelFilter): ng.IPromise<ITodoModel> {
        return this.todoApi.getTodoById(modelFilter.id);
    }
}

App.addController("todoController", TodoController, "todoApi");