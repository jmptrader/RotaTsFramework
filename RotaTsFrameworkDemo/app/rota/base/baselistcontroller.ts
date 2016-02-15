//#region Imports
import {IBundle, IBaseModelController, IBaseModel, IBaseListController,
    IPager, IPagingListModel, IListPageOptions, IBaseListModelFilter, IGridOptions} from "./interfaces"
//deps
import {BaseModelController} from "./basemodelcontroller"
//#endregion

//#region BaseListController

/**
 * Base List Controller
 */
abstract class BaseListController<TModel extends IBaseModel, TModelFilter extends IBaseListModelFilter>
    extends BaseModelController<TModel> implements IBaseListController<TModel, TModelFilter> {
    //#region Props
    private static newItemFieldName = 'id';
    /**
     * List controller options
     */
    protected listPageOptions: IListPageOptions;
    // $scope: IListControllerScope<TModel>;
    private _gridApi: uiGrid.IGridApi;
    /**
     * Grid Api
     * @returns {uiGrid.IGridApi} Grid Api
     */
    get gridApi(): uiGrid.IGridApi { return this._gridApi; }
    set gridApi(value: uiGrid.IGridApi) { this._gridApi = value; }

    private _gridOptions: IGridOptions;
    /**
     * Grid options
     * @returns {uiGrid.IGridOptions} Grid options
     */
    get gridOptions(): IGridOptions { return this._gridOptions; }
    set gridOptions(value: IGridOptions) { this._gridOptions = value; }
    /**
     * Grid data
     * @returns {TModel[]} 
     */
    get gridData(): TModel[] { return <TModel[]>this.gridOptions.data; }
    /**
     * Selected rows
     * @returns {} 
     */
    get gridSeletedRows(): any[] { return this.gridApi.selection.getSelectedRows(); }

    private _filter: any;
    /**
     * Filter object,includes all filter criteria to send getModel method as param
     * @returns {any} 
     */
    get filter(): any { return this._filter; }
    set filter(value: any) { this._filter = value; }
    //#endregion

    constructor(bundle: IBundle, options?: IListPageOptions) {
        super(bundle);

        this.listPageOptions = angular.extend({
            initialLoad: true,
            pagingEnabled: true,
            newItemFieldName: BaseListController.newItemFieldName
        }, options);

        this.initGrid();
    }

    //#region BaseModelController methods
    /**
    * @abstract Get model
    * @param args Model
    */
    abstract getModel(modelFilter?: TModelFilter): ng.IPromise<Array<TModel>> | Array<TModel> |
        ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Set model after data fetched
     * @param model Model
     */
    protected setModel(model: IPagingListModel<TModel> | Array<TModel>): IPagingListModel<TModel> | Array<TModel> {
        if (this.listPageOptions.pagingEnabled) {
            this.gridOptions.totalItems = (<IPagingListModel<TModel>>model).total || 0;
            this.gridOptions.data = (<IPagingListModel<TModel>>model).data;
        } else {
            this.gridOptions.data = <Array<TModel>>model;
        }
        return model;
    }
    /**
     * Override loadedMethod to show notfound message
     * @param model Model
     */
    protected loadedModel(model: TModel | Array<TModel> | IPagingListModel<TModel>): void {
        let noData = model === undefined || model === null;

        if (!noData) {
            if (this.listPageOptions.pagingEnabled) {
                noData = (<IPagingListModel<TModel>>model).data.length === 0;
            } else {
                noData = (<Array<TModel>>model).length === 0;
            }
        }

        if (noData) {
            this.toastr.warn({ message: this.localization.getLocal("rota.kayitbulunamadi") });
        }
    }

    //#endregion

    //#region Grid methods
    /**
    * Initialize grid
    */
    private initGrid(): void {
        const options = this.getDefaultGridOptions();
        this.gridOptions = angular.extend(options, { columnDefs: this.getGridColumns(options) });
        //default buttons
        const defaultButtons = this.getDefaultGridButtons();
        this.gridOptions.columnDefs = this.gridOptions.columnDefs.concat(defaultButtons);
        //load initially if enabled
        if (this.listPageOptions.initialLoad) {
            this.initSearchModel();
        }
    }
    /**
     * Get default buttons
     */
    protected getDefaultGridButtons(): uiGrid.IColumnDef[] {
        const buttons: uiGrid.IColumnDef[] = [];
        const getButton = (name: string, template: string): any => {
            return {
                name: name,
                cellClass: 'col-align-center',
                width: '30',
                displayName: '',
                enableColumnMenu: false,
                cellTemplate: template
            };
        }
        //edit button
        if (this.listPageOptions.editState && this.gridOptions.showEditButton) {
            const editbutton = getButton('edit-button',
                '<a class="btn btn-default btn-xs" ng-click="grid.appScope.vm.goToDetailState(row.entity[\'id\'])"' +
                ' tooltip=\'Detay\' tooltip-placement="bottom"><i class="glyphicon glyphicon-edit"></i></a>');
            buttons.push(editbutton);
        }
        //delete button
        if (this.gridOptions.showDeleteButton) {
            const editbutton = getButton('delete-button', '<a class="btn btn-default btn-xs" ng-click="grid.appScope.vm.deleteEntity() tooltip=\'Detay\'' +
                'tooltip-placement="bottom"><i class="glyphicon glyphicon-trash text-danger"></i></a>');
            buttons.push(editbutton);
        }
        return buttons;
    }
    /**
     * @abstract Grid Columns
     * @param options Grid Columns
     * @returns {uiGrid.IColumnDef} ui-grid columns definition
     */
    abstract getGridColumns(options: IGridOptions): uiGrid.IColumnDef[];
    /**
     * Default grid options
     */
    protected getDefaultGridOptions(): IGridOptions {
        return {
            showEditButton: true,
            showDeleteButton: false,
            //Row selection
            enableRowSelection: false,
            enableSelectAll: true,
            multiSelect: true,
            //Data
            data: [],
            //Pager
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: this.config.gridDefaultPageSize,
            useExternalPagination: true,
            //Export
            exporterCsvFilename: 'myFile.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [5, 5, 5, 5] },
            exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
            exporterPdfHeader: { text: this.routing.activeMenu.title, style: 'headerStyle' },
            exporterPdfFooter: (currentPage: number, pageCount: number) => {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: docDefinition => {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'A4',
            exporterPdfMaxGridWidth: 450,
            //exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            //Register
            onRegisterApi: gridApi => {
                this.gridApi = gridApi;
                //Paging
                gridApi.pagination.on.paginationChanged(this.$scope, (currentPage: number, pageSize: number) => {
                    this.initSearchModel({ currentPage: currentPage, pageSize: pageSize });
                });
            }
            //rowTemplate: '<div style="background-color: aquamarine" ng-click="grid.appScope.goEditState(row)" ' +
            //'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ' +
            //'class="ui-grid-cell" ui-grid-cell></div>'
        };
    }
    /**
     * Clear grid
     */
    clearGrid(): void {
        this.gridOptions.data = [];
    }
    /**
     * Clear selected rows
     */
    clearSelectedRows(): void {
        this.gridApi.selection.clearSelectedRows();
    }
    /**
     * Export grid
     * @param rowType
     * @param format
     */
    exportGrid(rowType: string, format: string): void {
        this.gridApi.exporter[format](rowType, 'all');
    }
    //#endregion

    //#region List Model methods
    /**
    * Starts getting model and binding
    * @param pager Paging pager
    */
    initSearchModel(pager?: IPager): void {
        let filter = angular.extend({}, this.filter);
        if (this.listPageOptions.pagingEnabled) {
            filter = angular.extend(filter, pager ||
                {
                    currentPage: 1,
                    pageSize: this.config.gridDefaultPageSize
                });
        }
        this.initModel(filter);
    }
    /**
     * Go detail state with id param provided
     * @param id
     */
    goToDetailState(id: string) {
        return this.routing.go(this.listPageOptions.editState, id && { id: id });
    }

    //#endregion
}
//#endregion

export {BaseListController}