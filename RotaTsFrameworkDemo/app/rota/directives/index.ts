import "./rtMenu"
import "./rtSpinner"
import "./rtgrid"
import "./rtpanel"

angular.module('rota.directives',
    ['rota.directives.rtmenu',
        'rota.directives.rtspinner',
        'rota.directives.rtgrid',
        'rota.directives.rtpanel'
    ]);