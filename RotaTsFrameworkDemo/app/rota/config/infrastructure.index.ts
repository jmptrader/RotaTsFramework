import "../base/index"
import "../config/config"
import "../services/index"
import "../directives/index"

angular.module('rota', [
    'rota.services',
    'rota.config',
    'rota.directives'
]);
