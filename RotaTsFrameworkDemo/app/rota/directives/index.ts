import "./rtMenu"
import "./rtSpinner"
import "./rtgrid"
import "./rtpanel"
import "./rtform"
//import "./rtlistbuttons"

angular.module('rota.directives',
    ['rota.directives.rtmenu',
        'rota.directives.rtspinner',
        'rota.directives.rtgrid',
        'rota.directives.rtpanel',
        'rota.directives.rtform'
       // 'rota.directives.rtlistbuttons'
    ]);