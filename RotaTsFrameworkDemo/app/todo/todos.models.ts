import {IBaseModel} from "../rota/base/interfaces";

interface ITodoModel extends IBaseModel {
    text: string;
    done: boolean;
    id: number;
}

export {ITodoModel}

