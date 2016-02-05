require.config({
    baseUrl: '.',

    paths: {
        //core
        'jquery': './app/rota/core/jquery-2.1.4.min',
        'angular': './app/rota/core/angular',
        'angular-ui-router': './app/rota/core/angular-ui-router',
        'angular-bootstrap': './app/rota/core/ui-bootstrap-tpls-1.1.2.min',
        'angular-sanitize': './app/rota/core/angular-sanitize',
        'angular-animate': './app/rota/core/angular-animate',
        //libs
        'toastr': './app/rota/lib/toastr.min',
        'underscore': './app/rota/lib/underscore.min',
        'underscore-string': './app/rota/lib/underscore.string.min',
        'i18n': './app/rota/lib/i18n',
        'moment': './app/rota/lib/moment.min',
        'spinner': './app/rota/lib/spin.min',
        'bootstrap': './app/rota/lib/bootstrap.min',
        'grid': './app/rota/lib/ui-grid.min',
        //relative paths
        base: './app/rota/base',
        config: './app/rota/config',
        core: './app/rota/core',
        lib: './app/rota/lib'
    },

    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps: ['jquery']
        },
        toastr: {
            deps: ['jquery']
        },
        angular: {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        grid: {
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