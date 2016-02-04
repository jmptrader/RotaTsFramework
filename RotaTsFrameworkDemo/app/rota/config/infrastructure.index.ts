import "../base/index"
import "../config/config"
import "../services/index"
import "../directives/index"
import "../shell/shell.controller"

angular.module('rota', [
    'rota.services',
    'rota.config',
    'rota.directives',
    'rota.shell',
     /*lib & core loaded in vendor.index*/
    'rota.lib',
    'rota.core'
]);
