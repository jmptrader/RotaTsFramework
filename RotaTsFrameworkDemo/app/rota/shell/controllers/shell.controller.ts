import {ICommon, IRotaRootScope} from '../../services/common.interface';
import {IRouting} from '../../services/routing.interface';
import {IMainConfig} from '../../config/config';
/**
 * Shell controller - this is the outter controller 
 */
class ShellController {
    private _isBusy: boolean;
    get isBusy(): boolean { return this._isBusy; }

    private _spinnerOptions: SpinnerOptions;
    get spinnerOptions(): SpinnerOptions { return this._spinnerOptions; }


    static $inject = ['$rootScope', 'Routing', 'Config'];
    constructor(private $rootScope: IRotaRootScope,
        private routing: IRouting,
        private config: IMainConfig) {

        this.setSpinner();
        //forms availablty in modal
        $rootScope.forms = {};
    }
    /**
     * Refresh state
     */
    refresh(): void {
        this.routing.reload();
    }
    /**
     * Set spinner settings
     */
    setSpinner() {
        //register main spinner events
        this.$rootScope.$on(this.config.eventNames.ajaxStarted, () => {
            this._isBusy = true;
        });
        this.$rootScope.$on(this.config.eventNames.ajaxStarted, () => {
            this._isBusy = false;
        });
        //spinner settings
        this._spinnerOptions = {
            lines: 13, // The number of lines to draw
            length: 1, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#FFC280', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };
    }
}