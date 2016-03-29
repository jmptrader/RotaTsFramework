import {IBaseModel,IBaseCrudModel, IBaseListModelFilter} from "../rota/base/interfaces";

interface ITodoModel extends IBaseCrudModel {
    text?: string;
    done?: boolean;
    id: number;
    
}

interface ITodoFilter extends IBaseListModelFilter {
    Text: string;
}

export {ITodoModel, ITodoFilter}

