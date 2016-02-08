import { App } from "app/rota/config/app";
import { IBaseApi, BaseApi } from "app/rota/base/baseapi";
import {ITodoModel, ITodoFilter}  from "todos.models";


interface ITodoApi extends IBaseApi {
    getTodos(modelFilter: ITodoFilter): ng.IPromise<ITodoModel[]>;
    getTodoById(id: number): angular.IPromise<ITodoModel>;
    save(model: ITodoModel): ng.IPromise<ITodoModel>;
    deleteById(id: number): ng.IPromise<any>;
}

class TodoApi extends BaseApi implements ITodoApi {

    getTodos(modelFilter: ITodoFilter): ng.IPromise<ITodoModel[]> {
        return this.post<ITodoModel[]>("todo/getall", modelFilter);
    }

    getTodoById(id: number): ng.IPromise<ITodoModel> {
        return this.get<ITodoModel>("todo/getbyid?id=" + id);
    }

    save(model: ITodoModel): ng.IPromise<ITodoModel> {
        return this.post<ITodoModel>('todo/save', model);
    }

    deleteById(id: number): ng.IPromise<any> {
        return this.post('todo/deletebyid?id=' + id);
    }
}
//Register
App.addApi("todoApi", TodoApi);
//Export
export {ITodoApi, TodoApi}
