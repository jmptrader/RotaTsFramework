import {App} from "app/rota/config/app";
import {BaseCrudController} from "app/rota/base/basecrudcontroller";
import {IBundle, IBaseCrudModelFilter, ISaveOptions, IServerResponse, IValidationItem} from 'app/rota/base/interfaces';

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

    //afterSaveModel(options: ISaveOptions): ng.IPromise<any> {
    //    if (!options.goon)
    //        this.routing.go('shell.content.todos');
    //    return null;
    //}


    validateModel(errors: IValidationItem[], options: ISaveOptions): ng.IPromise<IValidationItem[]> | IValidationItem[] {
        this.model.text.length < 3 && errors.push('must be higher than 3 chars');
        return errors;
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