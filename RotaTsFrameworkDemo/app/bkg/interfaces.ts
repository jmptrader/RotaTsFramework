import {IBaseCrudModel} from 'app/rota/base/interfaces';

interface IBooking extends IBaseCrudModel {
    bkgNo?: string;
    tasimalar?: ITasima[];
}

interface ITasima extends IBaseCrudModel {

}

export {IBooking, ITasima}