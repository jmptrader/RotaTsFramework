//#region Imports
import {IBundle, IBaseModel, IPager, IPagingListModel, IListPageOptions, IBaseListModelFilter,
    IGridOptions, IBaseListModel,  IListPageLocalization} from "./interfaces"
import {BadgeTypes} from '../services/titlebadges.service';
import {ITitleBadge, ITitleBadges} from '../services/titlebadges.interface';
import {IException} from '../services/common.interface';
//deps
import {BaseModelController} from "./basemodelcontroller"
import * as _ from 'underscore';
//#endregion

//#region BaseListController
/**
 * Base List Controller
 */
abstract class BaseListController<TModel extends IBaseModel, TModelFilter extends IBaseListModelFilter>
    extends BaseModelController<TModel> {
    //#region Props
    /**
     * Localized values for crud page
     */
    private static localizedValues: IListPageLocalization;
    /**
     * List controller options
     */
    listPageOptions: IListPageOptions;

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
     * @returns {IBaseListModel<TModel>}
     */
    get gridData(): IBaseListModel<TModel> { return <IBaseListModel<TModel>>this.gridOptions.data; }
    /**
     * Selected rows
     * @returns {} 
     */
    get gridSeletedRows(): any[] { return this.gridApi.selection.getSelectedRows(); }

    private _filter: TModelFilter;
    /**
     * Filter object,includes all filter criteria to send getModel method as param
     * @returns {IBaseListModelFilter}
     */
    get filter(): TModelFilter { return this._filter; }
    set filter(value: TModelFilter) { this._filter = value; }
    /**
     * Recourd count badge
     * @returns {ITitleBadge}
     */
    get recordcountBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Recordcount]; }
    /**
     * Selected Recourd count badge
     * @returns {ITitleBadge}
     */
    get selectedcountBadge(): ITitleBadge { return this.titlebadges.badges[BadgeTypes.Selectedcount]; }
    //#endregion

    //#region Bundle Services
    static injects = BaseModelController.injects.concat(['TitleBadges', 'uiGridConstants', 'uiGridExporterConstants']);
    protected titlebadges: ITitleBadges;
    protected uigridconstants: uiGrid.IUiGridConstants;
    protected uigridexporterconstants: uiGrid.exporter.IUiGridExporterConstants;
    //#endregion

    //#region Init
    constructor(bundle: IBundle, options?: IListPageOptions) {
        super(bundle);

        this.listPageOptions = angular.extend({
            initialLoad: true,
            pagingEnabled: true
        }, options);

        this.recordcountBadge.show = true;
        //set grid features
        this.initGrid();
    }
    /**
     * Update bundle
     * @param bundle IBundle
     */
    initBundle(bundle: IBundle): void {
        super.initBundle(bundle);

        this.titlebadges = bundle.systemBundles["titlebadges"];
        this.uigridconstants = bundle.systemBundles["uigridconstants"];
        this.uigridexporterconstants = bundle.systemBundles["uigridexporterconstants"];
    }
    /**
     * Store localized value for performance issues (called in basecontroller)
     */
    protected storeLocalization(): void {
        if (BaseListController.localizedValues) return;

        BaseListController.localizedValues = {
            kayitbulunamadi: this.localization.getLocal('rota.kayitbulunamadi'),
            deleteconfirm: this.localization.getLocal('rota.deleteconfirm'),
            deleteconfirmtitle: this.localization.getLocal('rota.deleteconfirmtitle'),
            deleteselected: this.localization.getLocal('rota.onaysecilikayitlarisil')
        };
    }
    //#endregion

    //#region BaseModelController methods
    /**
    * @abstract Get model
    * @param args Model
    */
    abstract getModel(modelFilter?: IBaseListModelFilter): ng.IPromise<IBaseListModel<TModel>> |
        IBaseListModel<TModel> | ng.IPromise<IPagingListModel<TModel>> | IPagingListModel<TModel>;
    /**
     * Set model after data fetched
     * @param model Model
     */
    protected setModel(model: IBaseListModel<TModel> | IPagingListModel<TModel>): IBaseListModel<TModel> | IPagingListModel<TModel> {
        if (this.listPageOptions.pagingEnabled) {
            this.gridOptions.totalItems = (<IPagingListModel<TModel>>model).total || 0;
            this.gridOptions.data = (<IPagingListModel<TModel>>model).data;
        } else {
            this.gridOptions.data = <IBaseListModel<TModel>>model;
        }
        return model;
    }
    /**
     * Override loadedMethod to show notfound message
     * @param model Model
     */
    protected loadedModel(model: IBaseListModel<TModel> | IPagingListModel<TModel>): void {
        let recCount = 0;
        if (model) {
            if (this.listPageOptions.pagingEnabled) {
                recCount = (<IPagingListModel<TModel>>model).total;
            } else {
                recCount = (<IBaseListModel<TModel>>model).length;
            }
        }
        if (recCount === 0) {
            this.toastr.warn({ message: BaseListController.localizedValues.kayitbulunamadi });
        }
        this.recordcountBadge.description = recCount.toString();
    }
    //#endregion

    //#region Grid methods
    /**
    * Initialize grid
    */
    private initGrid(): void {
        //get default options
        const options = this.getDefaultGridOptions();
        //merge user-defined cols
        this.gridOptions = angular.extend(options, { columnDefs: this.getGridColumns(options) });
        //add default button cols
        const defaultButtons = this.getDefaultGridButtons();
        this.gridOptions.columnDefs = this.gridOptions.columnDefs.concat(defaultButtons);
        //set pagination
        this.gridOptions.enablePagination =
            this.gridOptions.enablePaginationControls = this.listPageOptions.pagingEnabled;
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
        const getButtonColumn = (name: string, template: string): any => {
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
            const editbutton = getButtonColumn('edit-button',
                '<a class="btn btn-default btn-xs" ng-click="grid.appScope.vm.goToDetailState(row.entity[\'id\'])"' +
                ' uib-tooltip=\'Detay\' tooltip-placement="top"><i class="glyphicon glyphicon-edit"></i></a>');
            buttons.push(editbutton);
        }
        //delete button
        if (this.gridOptions.showDeleteButton) {
            const editbutton = getButtonColumn('delete-button', '<a class="btn btn-default btn-xs" ' +
                'ng-click="grid.appScope.vm.initDeleteModel(row.entity[\'id\'])" uib-tooltip=\'Sil\'' +
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
            onRegisterApi: gridApi => {
                this.gridApi = gridApi;
                //register paging event if enabled
                if (this.listPageOptions.pagingEnabled) {
                    gridApi.pagination.on.paginationChanged(this.$scope, (currentPage: number, pageSize: number) => {
                        this.initSearchModel({ currentPage: currentPage, pageSize: pageSize });
                    });
                }
                //register datachanges
                gridApi.grid.registerDataChangeCallback((grid: uiGrid.IGridInstanceOf<any>) => {
                    this.recordcountBadge.description = this.gridData.length.toString();
                }, [this.uigridconstants.dataChange.ROW]);
                //register selection changes
                const selChangedFn = () => {
                    this.selectedcountBadge.show = !!this.gridSeletedRows.length;
                    this.selectedcountBadge.description = this.gridSeletedRows.length.toString();
                }
                gridApi.selection.on.rowSelectionChanged(this.$scope, row => {
                    selChangedFn();
                });
                gridApi.selection.on.rowSelectionChangedBatch(this.$scope, rows => {
                    selChangedFn();
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
     * @param {string} rowTypes which rows to export, valid values are uiGridExporterConstants.ALL,
     * @param {string} colTypes which columns to export, valid values are uiGridExporterConstants.ALL,
     */
    exportGrid(rowType: string, colTypes: string): void {
        this.gridApi.exporter[colTypes](rowType, this.uigridexporterconstants.ALL);
    }
    //#endregion

    //#region List Model methods
    /**
     * Get model by key
     * @param key Unique key
     */
    getModelItemByKey(key: number): TModel {
        return _.findWhere(this.gridData, { id: key });
    }
    /**
     * Remove model item from grid datasource
     * @param key Unique key
     */
    removeModelItemByKey(key: number): void {
        const model = this.getModelItemByKey(key);
        if (model) {
            const index = this.gridData.indexOf(model);
            //grid watch data changes
            this.gridData.splice(index, 1);
        }
    }
    /**
    * Starts getting model and binding
    * @param pager Paging pager
    */
    initSearchModel(pager?: IPager): ng.IPromise<IBaseListModel<TModel>> | ng.IPromise<IPagingListModel<TModel>> {
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
    goToDetailState(id: string): ng.IPromise<any> {
        //for list navigation
        const idList = _.pluck(this.gridData, 'id');
        return this.routing.go(this.listPageOptions.editState, id && { id: id, navItems: idList });
    }
    /**
     * Init deletion model by unique key
     * @param id Unique id
     */
    protected initDeleteModel(id: number): ng.IPromise<any> {
        if (id === undefined || id === null || !id) return undefined;

        const confirmText = BaseListController.localizedValues.deleteconfirm;
        const confirmTitleText = BaseListController.localizedValues.deleteconfirmtitle;
        return this.dialogs.showConfirm({ message: confirmText, title: confirmTitleText }).then(() => {
            //call delete model
            const deleteResult = this.deleteModel(id);
            //removal of model depends on whether result is promise or void
            if (this.common.isPromise(deleteResult)) {
                return deleteResult.then(() => {
                    this.removeModelItemByKey(id);
                }, (reason: IException) => {
                    this.errorModel(reason);
                });
            }
            this.removeModelItemByKey(id);
            return undefined;
        });
    }
    /**
     * Delete Model
     * @param id Unique key
     * @description Remove item from grid datasource.Must be overrided to implament your deletion logic and call super.deleteModel();
     */
    deleteModel(id: number | number[]): ng.IPromise<any> | void {
        return undefined;
    }
    /**
     * Init deletetion of selected rows
     */
    initDeleteSelectedModels(): ng.IPromise<any> {
        if (!this.gridSeletedRows.length) return undefined;

        const confirmText = BaseListController.localizedValues.deleteselected;
        const confirmTitleText = BaseListController.localizedValues.deleteconfirmtitle;
        return this.dialogs.showConfirm({ message: confirmText, title: confirmTitleText }).then(() => {
            const keyArray: number[] = _.pluck(this.gridSeletedRows, 'id');
            //call delete model
            const deleteResult = this.deleteModel(keyArray);
            //removal of model depends on whether result is promise or void
            if (this.common.isPromise(deleteResult)) {
                return deleteResult.then(() => {
                    keyArray.forEach((key) => {
                        this.removeModelItemByKey(key);
                    });
                }, (reason: IException) => {
                    this.errorModel(reason);
                });
            }
            keyArray.forEach((key) => {
                this.removeModelItemByKey(key);
            });
            return undefined;
        });
    }

    //#endregion
}
//#endregion

export {BaseListController}