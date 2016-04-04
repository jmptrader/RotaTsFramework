import {IRouting} from "./rota/services/routing.interface";
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
            id: 0,
            isMenu: true,
            menuUrl: 'http://ynl.bimar.com',
            title: 'Ynl',
            menuIcon: 'microphone'
        },
        {
            id: 10,
            title: 'Booking İşlemleri',
            isMenu: true,
            menuIcon: 'cog'
        },
        {
            id: 11,
            title: 'Todo İşlemleri',
            isMenu: true,
            menuIcon: 'circle-o'
        },
        {
            title: 'Todos',
            menuIcon: 'list',
            id: 1,
            parentId: 11,
            name: 'shell.content.todos',
            controller: 'todosController',
            templateUrl: 'app/todo/todos.html',
            url: 'todos',
            isMenu: true
        }, {
            id: 2,
            menuIcon: 'flag-o',
            title: 'Todo',
            parentId: 1,
            name: 'shell.content.todo',
            controller: 'todoController',
            templateUrl: 'app/todo/todo.html',
            url: 'todos/:id'
        },
        {
            id: 3,
            menuIcon: 'user',
            title: 'Booking',
            abstract: true,
            parentId: 10,
            name: 'shell.content.bkg',
            controller: 'bkgController',
            controllerUrl: 'app/bkg/bkg.controller.js',
            templateUrl: 'app/bkg/bkg.html',
            url: 'bkg/:id',
            isMenu: true,
            menuUrl: '#/bkg/new/genelbilgiler'
        },
        {
            id: 4,
            name: 'shell.content.bkg.genelbilgiler',
            parentId: 3,
            title: 'Genel Bilgiler',
            menuIcon: 'flag-o',
            controller: 'bkgGenelBilgilerController',
            controllerUrl: 'app/bkg/bkg.genelbilgiler.controller.js',
            templateUrl: 'app/bkg/bkg.genelbilgiler.html',
            url: 'genelbilgiler',
            isNestedState: true
        },
        {
            id: 99,
            parentId: 4,
            isMultiViewState: true
        },
        {
            id: 15,
            parentId: 3,
            name: 'shell.content.bkg.konteynerler',
            abstract: true,
            url: 'konteynerlar',
            isNestedState: true
        },
        {
            id: 5,
            name: 'shell.content.bkg.konteynerler.liste',
            parentId: 15,
            title: 'Konteynerlar',
            menuIcon: 'road',
            controller: 'bkgKonteynerlarController',
            controllerUrl: 'app/bkg/bkg.konteynerlar.controller.js',
            templateUrl: 'app/bkg/bkg.konteynerlar.html',
            url: 'liste',
            isNestedState: true
        },
        {
            id: 6,
            parentId: 15,
            name: 'shell.content.bkg.konteynerler.new',
            controller: 'bkgKonteynerController',
            controllerUrl: 'app/bkg/bkg.konteyner.controller.js',
            templateUrl: 'app/bkg/bkg.konteyner.html',
            url: ':konteynerId',
            params: { konteynerId: 'new' },
            isNestedState: true
        }
    ]);
}]);
