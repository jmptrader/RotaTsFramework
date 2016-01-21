import { App } from "./rota/infrastructure/config/app";
import {Routing, IRouting} from "./rota/infrastructure/services/routing.service";
import {IMainConfig} from "./rota/infrastructure/config/config";
import {IBaseConfigProvider} from "./rota/infrastructure/base/baseconfig";

//Config phase
App.configure(["ConfigProvider", (config: IBaseConfigProvider<IMainConfig>) => {
    config.configure({
        baseUrl: "http://localhost:17637/api/"
    });
}]);
//Run phase
App.run(["Routing", (routing: IRouting) => {

    //routing.addStates([{
    //    name: 'todos',
    //    controller: 'todosController',
    //    templateUrl: 'app/todo/todos.html',
    //    url: '/todos'
    //}, {
    //        name: 'todo',
    //        controller: 'todoController',
    //        templateUrl: 'app/todo/todo.html',
    //        url: '/todos/:id'
    //    }]).go("todos");
}]);
