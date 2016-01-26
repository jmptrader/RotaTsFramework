﻿require.config({
    baseUrl: '.',

    paths: {
        //core
        'jquery': './app/rota/infrastructure/core/jquery-2.1.4.min',
        'angular': './app/rota/infrastructure/core/angular',
        'angular-ui-router': './app/rota/infrastructure/core/angular-ui-router',
        //libs
        'toastr': './app/rota/infrastructure/lib/toastr.min',
        'underscore': './app/rota/infrastructure/lib/underscore.min',
        'underscore-string': './app/rota/infrastructure/lib/underscore.string.min',
        'i18n': './app/rota/infrastructure/lib/i18n',
        'moment': './app/rota/infrastructure/lib/moment.min',
        //i18n
        'rota-resource': 'i18n!./app/rota/infrastructure/resources/nls/resources',
        //relative paths
        base: './app/rota/infrastructure/base',
        config: './app/rota/infrastructure/config',
        core: './app/rota/infrastructure/core'
    },

    shim: {
        jquery: {
            exports: '$'
        },
        toastr: {
            deps: ['jquery']
        },
        angular: {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        }
    }
});

require(['config/vendor.index'], (): void  => {
    require(['app/startup'], (): void => {
        //Tum rota dosyalari yuklendiktan sonra angulari başlatiyoruz
        angular.element(document).ready(() => {
            angular.bootstrap(document, ['rota-app']);
        });
    });
});