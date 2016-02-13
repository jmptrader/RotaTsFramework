import {App} from "app/rota/config/app";
import {IBundle} from 'app/rota/base/interfaces';
import {ITodoModel, ITodoFilter} from "./todos.models";
import {ITodoApi} from "./todos.service";
//deps
import {BaseListController} from "app/rota/base/baselistcontroller";
import "./todos.service";

class TodosController extends BaseListController<ITodoModel, ITodoFilter> {
    todoApi: ITodoApi;

    constructor(bundle: IBundle, todoApi: ITodoApi) {
        this.todoApi = todoApi;
        super(bundle, { editState: "shell.content.todo", pagingEnabled: false });
    }

    getModel(modelFilter: ITodoFilter): ng.IPromise<ITodoModel[]> {
        return this.todoApi.getTodos(modelFilter);
    }

    getGridColumns(options: uiGrid.IGridOptions): uiGrid.IColumnDef[] {
        return [{
            displayName: 'Text',
            width: '*',
            field: "text"
        },
        
            {
                name: 'Buttons',
                cellClass: 'col-align-center',
                width: '5%',
                displayName: '',
                enableColumnMenu: false,
                pinnedLeft: true ,
                cellTemplate: '<a ui-sref="shell.content.todo" tooltip=\'Detay\'' +
                'tooltip-placement="bottom"><i class="fa fa-2x fa-edit text-info"></i></a>'
            }    
        ];
    }
}

App.addController("todosController", TodosController, "todoApi");