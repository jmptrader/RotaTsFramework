import "./rtMenu"
import "./rtSpinner"
import "./rtGrid"
import "./rtPanel"
import "./rtForm"
import "./rtButton"
import "./rtListbuttons"
import "./rtI18n"

angular.module('rota.directives',
    ['rota.directives.rtmenu',
        'rota.directives.rtspinner',
        'rota.directives.rtgrid',
        'rota.directives.rtpanel',
        'rota.directives.rtbutton',
        'rota.directives.rtform',
        'rota.directives.rtlistbuttons',
        'rota.directives.rtI18n'
    ]);