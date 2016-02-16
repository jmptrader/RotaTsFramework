﻿//#region Imports
import {IBundle, IBaseModel, IPager, IPagingListModel, IListPageOptions, IBaseListModelFilter,
    IGridOptions, IListModel} from "./interfaces"
//deps
import {BaseModelController} from "./basemodelcontroller"
//#endregion

//#region BaseListController

/**
 * Base List Controller
 */
abstract class BaseListController<TModel extends IBaseModel, TModelFilter extends IBaseListModelFilter> extends BaseModelController<TModel>  {
    //#region Props
    private static newItemFieldName = 'id';
    /**
     * List controller options
     */
    protected listPageOptions: IListPageOptions;

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
     * @returns {IListModel<TModel>}
     */
    get gridData(): IListModel<TModel> { return <IListModel<TModel>>this.gridOptions.data; }
    /**
     * Selected rows
     * @returns {} 
     */
    get gridSeletedRows(): any[] { return this.gridApi.selection.getSelectedRows(); }

    private _filter: any;
    /**
     * Filter object,includes all filter criteria to send getModel method as param
     * @returns {IBaseListModelFilter}
     */
    get filter(): IBaseListModelFilter { return this._filter; }
    set filter(value: IBaseListModelFilter) { this._filter = value; }
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
    abstract getModel(modelFilter?: IBaseListModelFilter): ng.IPromise<IListModel<TModel>> |
        IListModel<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Set model after data fetched
     * @param model Model
     */
    protected setModel(model: IListModel<TModel> | IPagingListModel<TModel>): IListModel<TModel> | IPagingListModel<TModel> {
        if (this.listPageOptions.pagingEnabled) {
            this.gridOptions.totalItems = (<IPagingListModel<TModel>>model).total || 0;
            this.gridOptions.data = (<IPagingListModel<TModel>>model).data;
        } else {
            this.gridOptions.data = <IListModel<TModel>>model;
        }
        return model;
    }
    /**
     * Override loadedMethod to show notfound message
     * @param model Model
     */
    protected loadedModel(model: IListModel<TModel> | IPagingListModel<TModel>): void {
        let noData = model === undefined || model === null;

        if (!noData) {
            if (this.listPageOptions.pagingEnabled) {
                noData = (<IPagingListModel<TModel>>model).data.length === 0;
            } else {
                noData = (<IListModel<TModel>>model).length === 0;
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
                '<a class="btn btn-default btn-xs" ng-click="grid.appScope.vm.goToDetailState(row.entity[\'' + this.listPageOptions.newItemFieldName + '\'])"' +
                ' uib-tooltip=\'Detay\' tooltip-placement="top"><i class="glyphicon glyphicon-edit"></i></a>');
            buttons.push(editbutton);
        }
        //delete button
        if (this.gridOptions.showDeleteButton) {
            const editbutton = getButton('delete-button', '<a class="btn btn-default btn-xs" ' +
                'ng-click="grid.appScope.vm.deleteEntity(row.entity[\'' + this.listPageOptions.newItemFieldName + '\'])" uib-tooltip=\'Sil\'' +
                'tooltip-placement="top"><i class="glyphicon glyphicon-trash text-danger"></i></a>');
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
            showDeleteButton: true,
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
     * @param {string} rowTypes which rows to export, valid values are uiGridExporterConstants.ALL,
     * @param {string} colTypes which columns to export, valid values are uiGridExporterConstants.ALL,
     */
    exportGrid(rowType: string, colTypes: string): void {
        this.gridApi.exporter[colTypes](rowType, 'all');
    }
    //#endregion

    //#region List Model methods
    /**
    * Starts getting model and binding
    * @param pager Paging pager
    */
    initSearchModel(pager?: IPager): ng.IPromise<IListModel<TModel>> | ng.IPromise<IPagingListModel<TModel>> {
        let filter: IBaseListModelFilter = angular.extend({}, this.filter);
        if (this.listPageOptions.pagingEnabled) {
            filter = angular.extend(filter, pager ||
                {
                    currentPage: 1,
                    pageSize: this.config.gridDefaultPageSize
                });
        }
        return this.initModel(filter);
    }
    //#endregion

    //#region Button Clicks
    /**
    * Go detail state with id param provided
    * @param id
    */
    goToDetailState(id: string) {
        return this.routing.go(this.listPageOptions.editState, id && { id: id });
    }
    /**
     * Delete entity 
     * @param id Unique id
     */
    deleteEntity(id: string): void {
        throw new Error("unimplemented method exception");
    }
    //#endregion
}
//#endregion

export {BaseListController}