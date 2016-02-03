import {App} from "app/rota/config/app";
import {BaseCrudController, IBundle} from "app/rota/base/basecrudcontroller";

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoController extends BaseCrudController<ITodoModel> {
    todoApi: ITodoApi;

    constructor(bundle: IBundle, todoApi: ITodoApi) {
        this.todoApi = todoApi;
        super(bundle);
    }

    save(model: ITodoModel): ng.IPromise<ITodoModel> {
        return this.todoApi.save(model).then((model: ITodoModel) => {
            this.goBack();
            return model;
        });
    }

    deleteById(id: number): ng.IPromise<any> {
        return this.todoApi.deleteById(id).then(() => {
            this.goBack();
        });
    }

    getModel(): ng.IPromise<ITodoModel> {
        return this.todoApi.getTodoById(this.$stateParams.id);
    }
}

App.addController("todoController", TodoController, ["todoApi"]);