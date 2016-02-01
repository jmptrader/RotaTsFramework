import { App } from "./rota/config/app";
import {Routing, IRouting} from "./rota/services/routing.service";
import {IMainConfig} from "./rota/config/config";
import {IBaseConfigProvider} from "./rota/base/baseconfig";

//Config phase
App.configure(["ConfigProvider", (config: IBaseConfigProvider<IMainConfig>) => {
    config.configure({
        baseUrl: "http://localhost:17637/api/",
        appTitle: "Bimar SPA Todo Sample"
    });
}]);
//Run phase
App.run(["Routing", (routing: IRouting) => {

    routing.addMenus([{
        id: 1,
        name: 'todos',
        controller: 'todosController',
        templateUrl: 'app/todo/todos.html',
        url: '/todos'
    }, {
            id: 2,
            parentId: 1,
            name: 'todo',
            controller: 'todoController',
            templateUrl: 'app/todo/todo.html',
            url: '/todos/:id'
        }]).go("todos");
}]);
