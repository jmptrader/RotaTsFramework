import {App} from "app/rota/config/app";
import {IBundle, IGridOptions} from 'app/rota/base/interfaces';
import {ITodoModel, ITodoFilter} from "./todos.models";
import {ITodoApi} from "./todos.service";
//deps
import {BaseListController} from "app/rota/base/baselistcontroller";
import "./todos.service";

class TodosController extends BaseListController<ITodoModel, ITodoFilter> {

    todoApi: ITodoApi;

    constructor(bundle: IBundle) {
        super(bundle, { editState: "shell.content.todo", pagingEnabled: false });
    }

    getModel(modelFilter: ITodoFilter): ng.IPromise<ITodoModel[]> {
        return this.todoApi.getTodos(modelFilter);
    }

    getGridColumns(options: IGridOptions): uiGrid.IColumnDef[] {
        return [{
            displayName: 'Text',
            width: '*',
            field: "text"
        }
        ];
    }

    deleteModel(id: number | number[]): ng.IPromise<any> {
        if (this.common.isArray(id)) {
            const qAll: ng.IPromise<any>[] = [];
            id.forEach((key) => {
                qAll.push(this.todoApi.deleteById(key));
            });
            return this.$q.all(qAll);
        }
        return this.todoApi.deleteById(<number>id);
    }
}

App.addController("todosController", TodosController, "todoApi");