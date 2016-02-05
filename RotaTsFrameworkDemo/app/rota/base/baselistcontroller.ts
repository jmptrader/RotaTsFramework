//#region Imports
import {IBundle, IBaseModelController, IBaseModel, IBaseListController,
IListControllerScope, IPager, IPagingListModel, IListPageOptions} from "./interfaces"
//deps
import {BaseModelController} from "./basemodelcontroller"
//#endregion

//#region BaseListController

/**
 * Base List Controller
 */
abstract class BaseListController<TModel extends IBaseModel> extends BaseModelController<TModel> implements IBaseListController<TModel> {
    //#region Props
    private static newItemFieldName = 'id';
    /**
     * List controller options
     */
    private listPageOptions: IListPageOptions;
    $scope: IListControllerScope<TModel>;
    /**
     * Grid Api
     * @returns {} Grid Api
     */
    get gridApi(): uiGrid.IGridApi { return this.$scope.gridApi; }
    set gridApi(value: uiGrid.IGridApi) { this.$scope.gridApi = value; }
    /**
     * Grid options
     * @returns {} Grid options
     */
    get gridOptions(): uiGrid.IGridOptions { return this.$scope[this.config.gridDefaultOptionsName]; }
    set gridOptions(value: uiGrid.IGridOptions) { this.$scope[this.config.gridDefaultOptionsName] = value; }
    /**
     * Grid data
     * @returns {} 
     */
    get gridData(): TModel[] { return <TModel[]>this.gridOptions.data; }
    /**
     * Selected rows
     * @returns {} 
     */
    get gridSeletedRows(): any[] { return this.gridApi.selection.getSelectedRows(); }
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
    /**
    * Initialize grid
    */
    private initGrid(): void {
        const options = this.getDefaultGridOptions();
        this.gridOptions = angular.extend(options, { columnDefs: this.getGridColumns(options) });

        if (this.listPageOptions.initialLoad) {
            this.initSearchModel();
        }
    }
    abstract getModel(...args: any[]): ng.IPromise<Array<TModel>> | Array<TModel> |
        ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Grid Columns
     * @param options Grid Columns
     */
    abstract getGridColumns(options: uiGrid.IGridOptions): uiGrid.IColumnDef[];
    /**
     * Starts getting model and binding
     * @param pager
     */
    initSearchModel(pager?: IPager): void {
        const filterpager = angular.extend({}, this.$scope.filter, pager ||
            {
                currentPage: 1,
                pageSize: this.config.gridDefaultPageSize
            });

        this.initModel(filterpager);
    }
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
     * Default grid options
     */
    protected getDefaultGridOptions(): uiGrid.IGridOptions {
        return {
            //Row selection
            enableRowSelection: true,
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
    //UNDONE edit funtion
    goEditState(id: number) {
        //For navigation in crud page,navItems is populated depending on the current list
        //var uniqueFields = _.pluck(this.rowData, NEW_ITEM_FIELD_NAME);
        //return this.editState && this.go(this.editState, { id: id || 'new', navItems: uniqueFields });
    }
}
//#endregion

export {BaseListController}