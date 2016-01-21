require.config({
    baseUrl: '.',

    paths: {
        //'jquery': 'Scripts/jquery-2.1.4',
        //'toastr': 'Scripts/toastr',
        'angular': './app/rota/infrastructure/core/angular',
        'angular-ui-router': './app/rota/infrastructure/core/angular-ui-router',

        'underscore': './app/rota/infrastructure/lib/underscore.min',
        'underscore-string': './app/rota/infrastructure/lib/underscore.string.min',

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