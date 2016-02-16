import "../base/index"
import "../config/config"
import "../services/index"
import "../directives/index"
import "../filters/index"
import "../shell/shell.controller"

angular.module('rota', [
    'rota.services',
    'rota.config',
    'rota.directives',
    'rota.filters',
    'rota.shell',
    /*lib & core loaded in vendor.index*/
    'rota.lib',
    'rota.core'
]);
