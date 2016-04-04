import {IBaseCrudModel} from 'app/rota/base/interfaces';

interface IBooking extends IBaseCrudModel {
    bkgNo?: string;
    tasimalar?: ITasima[];
    konteynerlar: IKonteyner[];
}

interface IKonteyner extends IBaseCrudModel {
    prefix?: string;
}

interface ITasima extends IBaseCrudModel {
    yokNo: string;
}

export {IBooking, ITasima, IKonteyner}