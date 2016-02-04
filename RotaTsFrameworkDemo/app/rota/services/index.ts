import "./logger.service"
import "./routing.service"
import "./dialogs.service"
import "./common.service"
import "./caching.service"
import "./interceptors"

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
        'rota.misc.common',
        'rota.misc.dialog',
        'rota.misc.httpRequestTracker',
        'rota.misc.caching'
    ]);
//Rota module index
angular.module('rota.services',
    [
        'rota.services.log',
        'rota.services.routing',
        'rota.services.misc'
    ]);


