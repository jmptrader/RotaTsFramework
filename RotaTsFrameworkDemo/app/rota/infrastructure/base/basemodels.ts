interface IBaseModel {
    id: number;
}

interface IBaseCrudModel extends IBaseModel {
}

interface IBaseListModel<TModel extends IBaseModel> {
    [index: number]: TModel
}

interface IScopeModel<TModel extends IBaseModel> extends ng.IScope {
    model: TModel | IBaseListModel<TModel>
}


export {IBaseModel, IBaseListModel, IBaseCrudModel, IScopeModel}