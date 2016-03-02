import {App} from "app/rota/config/app";
import {BaseModalController} from "app/rota/base/basemodalcontroller";
import {IBaseModelFilter} from 'app/rota/base/interfaces';

import {ITodoModel} from "./todos.models";
import {ITodoApi} from "./todos.service";

import "./todos.service";

class TodoModalController extends BaseModalController<ITodoModel, ITodoModel> {
    todoApi: ITodoApi;


   
}

App.addController("todoModalController", TodoModalController, "todoApi");