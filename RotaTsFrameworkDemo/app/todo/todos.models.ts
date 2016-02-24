import {IBaseModel, IBaseListModelFilter} from "../rota/base/interfaces";

interface ITodoModel extends IBaseModel {
    text: string;
    done: boolean;
    id: number;
}

interface ITodoFilter extends IBaseListModelFilter {
    Text: string;
}

export {ITodoModel, ITodoFilter}

