import "./rtMenu"
import "./rtSpinner"
import "./rtGrid"
import "./rtPanel"
import "./rtForm"
import "./rtButton"
import "./rtListButtons"
import "./rtCrudButtons"
import "./rtI18n"
import "./rtFocus"
import "./rtSelect"
import "./rtMultiSelect"
import "./rtGridSelect"
import "./rtEditor"
import "./rtNumber"

angular.module('rota.directives',
    ['rota.directives.rtmenu',
        'rota.directives.rtspinner',
        'rota.directives.rtgrid',
        'rota.directives.rtpanel',
        'rota.directives.rtbutton',
        'rota.directives.rtform',
        'rota.directives.rtlistbuttons',
        'rota.directives.rtI18n',
        'rota.directives.rtcrudbuttons',
        'rota.directives.rtfocus',
        'rota.directives.rtselect',
        'rota.directives.rtmultiselect',
        'rota.directives.rtgridselect',
        'rota.directives.rteditor',
        'rota.directives.rtnumber'
    ]);