import {ITitleBadge, ITitleBadges} from './titlebadges.interface';
import {ILocalization} from './localization.interface';

export enum BadgeTypes {
    Editmode,
    Newmode,
    Invalid,
    Dirty,
    Recordcount,
    Selectedcount
}

class TitleBadges implements ITitleBadges {
    serviceName = "TitleBadges Service";
    badges: { [index: number]: ITitleBadge };

    static $inject = ['Localization'];
    constructor(private localization: ILocalization) {
        this.initBadges();
    }

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
            icon: 'check',
            tooltip: this.localization.getLocal('rota.kayitsayisi')
        };
    }

    clearBadges(): void {
        for (let i = BadgeTypes.Editmode; i < BadgeTypes.Selectedcount; i++) {
            this.badges[i].show = false;
        }
    }
}

//#region Register
var module: ng.IModule = angular.module('rota.services.titlebadges', []);
module.service('TitleBadges', TitleBadges);
//#endregion

export {TitleBadges}