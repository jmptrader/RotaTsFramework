﻿import {IRouting} from "./rota/services/routing.interface";
import {IMainConfig} from "./rota/config/config.interface";
import {IBaseConfigProvider} from "./rota/base/interfaces";
//deps
import { App } from "./rota/config/app";

//Config phase
App.configure(["ConfigProvider", (config: IBaseConfigProvider<IMainConfig>) => {
    config.configure({
        appTitle: "Bimar SPA Todo Sample"
    });
}]);
//Run phase
App.run(["Routing", (routing: IRouting) => {

    routing.addMenus([
        {
            title: 'Todos',
            menuIcon: 'list',
            id: 1,
            name: 'shell.content.todos',
            controller: 'todosController',
            templateUrl: 'app/todo/todos.html',
            url: 'todos'
        }, {
            id: 2,
            menuIcon: 'flag-o',
            title: 'Todo',
            parentId: 1,
            name: 'shell.content.todo',
            controller: 'todoController',
            templateUrl: 'app/todo/todo.html',
            url: 'todos/:id'

        }
    ]).start('shell.content.todos');
}]);
