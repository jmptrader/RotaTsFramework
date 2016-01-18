import {IBaseListModel, IBaseCrudModel, IBaseModel} from "../rota/infrastructure/base/basemodels";

interface ITodoModel extends IBaseModel {
    text: string;
    done: boolean;
    id: number;
}

export {ITodoModel}

