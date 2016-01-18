import {App} from "app/rota/infrastructure/config/app";
import {BaseListController, IBundle} from "app/rota/infrastructure/base/baselistcontroller";

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodosController extends BaseListController<ITodoModel> {
    todoApi: ITodoApi;

    constructor(bundle: IBundle, todoApi: ITodoApi) {
        this.todoApi = todoApi;
        super(bundle);
    }

    getModel(): ng.IPromise<ITodoModel[]> {
        return this.todoApi.getTodos();
    }
}

App.addController("todosController", TodosController, ["todoApi"]);