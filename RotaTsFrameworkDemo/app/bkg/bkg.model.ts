import {App} from "app/rota/config/app";
import {IBooking} from "./interfaces"
import {ModelStates} from "app/rota/base/interfaces"

App.addValue<IBooking>('bkg.model', { konteynerlar: [], id: 0, modelState: ModelStates.Added ,bkgNo:'yeniBooking'});