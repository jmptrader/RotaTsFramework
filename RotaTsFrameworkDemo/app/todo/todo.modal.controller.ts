import {App} from "app/rota/config/app";
import {BaseModalController} from "app/rota/base/basemodalcontroller";
import {IBaseModelFilter} from 'app/rota/base/interfaces';
import {ICrudServerResponse} from 'app/rota/services/common.interface';

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoModalController extends BaseModalController<ITodoModel, ITodoModel> {
    todoApi: ITodoApi;

    modalResult(data: ITodoModel): void {
        if (!data) super.closeModal();
        this.todoApi.save(data).then((result: ICrudServerResponse) => {
            super.modalResult(result.model);
        });
    }
}

App.addController("todoModalController", TodoModalController, "todoApi");