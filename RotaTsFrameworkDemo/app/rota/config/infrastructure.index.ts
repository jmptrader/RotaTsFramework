import "../base/index"
import "../config/config"
import "../services/index"
import "../directives/index"
import "../lib/index"
import "../shell/shell.controller"

angular.module('rota', [
    'rota.services',
    'rota.config',
    'rota.directives',
    'rota.shell'
]);
