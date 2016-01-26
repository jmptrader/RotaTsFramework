import "./logger"
import "./routing"
import "./common"

//Register Logger
angular.module('rota.services.log',
    [
        'rota.log.service'
    ]);

//Register Routing
angular.module('rota.services.routing',
    [
        'rota.routing.service'
    ]);
//Register UI
angular.module('rota.services.misc',
    [
        'rota.misc.common'
    ]);
//Rota module index
angular.module('rota.services',
    [
        'rota.services.log',
        'rota.services.routing',
        'rota.services.misc'
    ]);


