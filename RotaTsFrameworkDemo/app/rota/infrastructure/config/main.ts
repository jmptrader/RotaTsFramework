require.config({
    baseUrl: '.',

    paths: {
        //'jquery': 'Scripts/jquery-2.1.4',
        //'toastr': 'Scripts/toastr',
        'angular': './app/rota/core/angular',
        'angular-ui-router': './app/rota/core/angular-ui-router',

        base: './app/rota/base',
        config: './app/rota/config',
        core: './app/rota/core'
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