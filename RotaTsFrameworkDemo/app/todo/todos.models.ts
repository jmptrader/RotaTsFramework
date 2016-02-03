import {IBaseListModel, IBaseCrudModel, IBaseModel} from "../rota/base/basemodels";

interface ITodoModel extends IBaseModel {
    text: string;
    done: boolean;
    id: number;
}

export {ITodoModel}

