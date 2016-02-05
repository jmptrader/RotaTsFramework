import "./i18n"
import "./underscore.min"
import "./underscore.string.min"
import "spinner"
import "bootstrap"
import "grid"

import * as angular from "angular"

angular.module('rota.lib',
    [
        //Grid plugins
        'ui.grid', 'ui.grid.selection', 'ui.grid.pinning', 'ui.grid.pagination', 'ui.grid.exporter', 'ui.grid.grouping'
     
        ////Datetime picker
        //'ui.dateTimeInput',
        //'ui.bootstrap.datetimepicker',
        ////Dropdown select-ui
        //'ui.select',
        ////Hotkeys keyboard support
        //'cfp.hotkeys',
        ////ui-router plugins - sticky states for modal support
        //'ct.ui.router.extras.sticky',
        //'ct.ui.router.extras.previous',
        //'wysiwyg.module',
        ////Scroll
        //'duScroll'
    ]);