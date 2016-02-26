//#region Imports
import {ITitleBadge, ITitleBadges} from './titlebadges.interface';
import {ILocalization} from './localization.interface';
//#endregion

//#region TitleBadge Service
/**
 * Badge Types
 */
export enum BadgeTypes {
    Editmode,
    Newmode,
    Recordcount,
    Selectedcount,
    Cloning,
    Dirty,
    Invalid,
}
/**
 * TitleBadge Service
 */
class TitleBadges implements ITitleBadges {
    //#region Props
    serviceName = "TitleBadges Service";
    badges: { [index: number]: ITitleBadge };
    //#endregion

    //#region Init
    static $inject = ['Localization'];
    constructor(private localization: ILocalization) {
        this.initBadges();
    }
    /**
     * Create all badges
     */
    private initBadges(): void {
        this.badges = {};

        this.badges[BadgeTypes.Editmode] = {
            color: 'info',
            icon: 'edit',
            description: this.localization.getLocal('rota.kayitduzeltme')
        };

        this.badges[BadgeTypes.Newmode] = {
            color: 'info',
            icon: 'plus',
            description: this.localization.getLocal('rota.yenikayit')
        };
        this.badges[BadgeTypes.Cloning] = {
            color: 'danger',
            icon: 'copy',
            description: this.localization.getLocal('rota.kopyalaniyor')
        };
        this.badges[BadgeTypes.Invalid] = {
            color: 'danger',
            icon: 'exclamation',
            tooltip: this.localization.getLocal('rota.zorunlualanlarvar')
        };

        this.badges[BadgeTypes.Dirty] = {
            color: 'success',
            icon: 'pencil',
            tooltip: this.localization.getLocal('rota.duzeltiliyor')
        };

        this.badges[BadgeTypes.Recordcount] = {
            color: 'success',
            icon: 'reorder',
            tooltip: this.localization.getLocal('rota.kayitsayisi')
        };
        this.badges[BadgeTypes.Selectedcount] = {
            color: 'danger',
            icon: 'check'
        };
    }
    //#endregion

    //#region Methods
    /**
     * Hide all badges 
     */
    clearBadges(): void {
        for (let i = BadgeTypes.Editmode; i <= BadgeTypes.Invalid; i++) {
            this.badges[i].show = false;
        }
    }

    //#endregion
}

//#endregion

//#region Register
var module: ng.IModule = angular.module('rota.services.titlebadges', []);
module.service('TitleBadges', TitleBadges);
//#endregion

export {TitleBadges}