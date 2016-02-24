import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter} from 'app/rota/base/interfaces';

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoController extends BaseCrudController<ITodoModel> {
    todoApi: ITodoApi;

    constructor(bundle: IBundle) {
        super(bundle);
    }

    save(model: ITodoModel): ng.IPromise<ITodoModel> {
        this.dialogs.showConfirm({ message: 'Ar you sure to save ?' }).then(() => {
            this.logger.notification.info({ message: 'Yer you are sure' });
        }, () => {
            this.logger.notification.error({ message: 'Nope you are not sure' });
        });

        return this.todoApi.save(model).then((model: ITodoModel) => {
            return model;
        });
    }

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