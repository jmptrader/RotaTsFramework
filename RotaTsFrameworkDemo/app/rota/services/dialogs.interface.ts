//#region Imports
import {IBaseService} from './service.interface';
import {IBaseModel} from '../base/interfaces';
//#endregion

//#region Dialog Interfaces

/**
 * Dialog window options
 */
interface IDialogOptions {
    message: string,
    title?: string,
    okText?: string;
    windowClass?: string;
}
/**
 * Dialog window scope
 */
interface IDialogScope extends ng.IScope, IDialogOptions {
    ok(): void
}
/**
 * COnfirm window options
 */
interface IConfirmOptions extends IDialogOptions {
    cancelText?: string;
}
/**
 * Confirm window scope
 */
interface IConfirmScope extends IDialogScope, IConfirmOptions {
    cancel(): void;
}
/**
 * Progress options
 */
interface IProgressOptions {
    title?: string;
    percent: number;
}
/**
 * Progress scope
 */
interface IProgressScope extends ng.IScope, IProgressOptions {
}
/**
 * Progress modal instance
 */
interface IProgressModalInstance extends ng.ui.bootstrap.IModalServiceInstance {
    percent: number;
}
/**
 * Prompt window options
 */
interface IPromptOptions {
    title: string;
    subTitle: string;
    initValue?: string;
    okText?: string;
    cancelText?: string;
}
/**
 * Prompt window scope
 */
interface IPromptScope extends ng.IScope, IPromptOptions {
    value: any;
    ok(): void;
    cancel(): void;
}
/**
 * File updaload options
 */
interface IFileUploadOptions {
    /**
     * File extensions which will be granted to upload
     */
    allowedExtensions?: { [index: string]: string };
    /**
     * Send button text
     */
    sendText?: string;
}
/**
 * File Upload Scope
 */
interface IFileUploadScope extends ng.IScope, IFileUploadOptions {
    model: any;
    sendFile(): void;
    dismiss(): void;
}
/**
 * Options used in modal instance
 */
interface IModalInstanceOptions<TModel> {
    /**
     * Your custom modal model transferred to modal instance
     */
    model?: TModel;
    /**
     * Any custom additional data transferred to modal instance
     */
    params?: any;
}
/**
 * Modal options
 */
interface IModalOptions<TModel extends IBaseModel> extends ng.ui.bootstrap.IModalSettings {
    /**
     * Modal template url
     */
    templateUrl: string;
    /**
     * Controller url
     */
    controllerUrl?: string;
    /**
     * Modal instance options 
     */
    instanceOptions?: IModalInstanceOptions<TModel>;
    /**
     * Modal controller name.
     * @description Controller should be string or left undefined.In case of undefined,default modal controller assigned to modal (BaseModalController)
     */
    controller?: any;
}

//#endregion

//#region Dialog Service Interface

/**
 * Modal dialog service
 */
interface IDialogs extends IBaseService {
    /**
    * Show simple dialog with ok button
    * @param options Dialog options
    */
    showDialog(options: IDialogOptions): ng.IPromise<any>;
    /**
    * Show confirm dialog with ok,cancel buttons
    * @param options Confirm options
    */
    showConfirm(options: IConfirmOptions): ng.IPromise<any>;
    /**
    * Show progress based on percent value
    * @param options Progress dialog options
    */
    showProgress(options: IProgressOptions): IProgressModalInstance;
    /**
    * Show prompt dialog
    * @param options Prompt options
    */
    showPrompt(options: IPromptOptions): ng.IPromise<any>;
    /**
    * Show file upload dialog
    * @param options FileUpload options
    */
    showFileUpload(options: IFileUploadOptions): ng.IPromise<any>;
    /**
   * Show modal window
     * @description if controller not provided,BaseModalController will be used.
     * if ControllerUrl not defined,it will be looked in templateUrl path
     * @param options Modal options
   */
    showModal<TModel extends IBaseModel, TResult extends {}>(options: IModalOptions<TModel>): ng.IPromise<TResult>;
}

//#endregion

export {IDialogOptions, IDialogScope, IConfirmOptions, IConfirmScope, IProgressOptions, IProgressScope,
IProgressModalInstance, IPromptOptions, IPromptScope, IFileUploadOptions, IFileUploadScope, IModalOptions, IDialogs, IModalInstanceOptions}