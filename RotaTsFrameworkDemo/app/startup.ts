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
            id: 3,
            title: 'Booking',
            name: 'shell.content.bkg',
            abstract: true,
            controller: 'bkgController',
            controllerUrl: 'app/bkg/bkg.controller.js',
            templateUrl: 'app/bkg/bkg.html',
            url: 'bkg/:id'
        },
        {
            id: 4,
            name: 'shell.content.bkg.genelbilgiler',
            controller: 'bkgGenelBilgilerController',
            controllerUrl: 'app/bkg/bkg.genelbilgiler.controller.js',
            templateUrl: 'app/bkg/bkg.genelbilgiler.html',
            url: 'genelbilgiler'
        },
        {
            id: 5,
            name: 'shell.content.bkg.konteynerler',
            controller: 'bkgKonteynerlarController',
            controllerUrl: 'app/bkg/bkg.konteynerlar.controller.js',
            templateUrl: 'app/bkg/bkg.konteynerlar.html',
            url: 'konteynerlar'
        },
        {
            id: 6,
            name: 'shell.content.bkg.konteyner',
            controller: 'bkgKonteynerController',
            controllerUrl: 'app/bkg/bkg.konteyner.controller.js',
            templateUrl: 'app/bkg/bkg.konteyner.html',
            url: 'konteynerlar/:konteynerId',
            params: { konteynerId: 'new' }
        }

    ]).start('shell.content.bkg.genelbilgiler', { id: 1 });
}]);
