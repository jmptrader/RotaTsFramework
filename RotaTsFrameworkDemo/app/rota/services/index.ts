import "./logger.service"
import "./routing.service"
import "./dialogs.service"
import "./common.service"
import "./caching.service"
import "./localization.service"
import "./interceptors.service"
import "./titlebadges.service"

//service module index
angular.module('rota.services',
    [
        'rota.services.log',
        'rota.services.common',
        'rota.services.dialog',
        'rota.services.httpRequestTracker',
        'rota.services.caching',
        'rota.services.localization',
        'rota.services.titlebadges',
        'rota.services.routing'
    ]);


