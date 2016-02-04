import {IBaseService} from './service.interface';

interface IDialogOptions {
    message: string,
    title?: string,
    okText?: string;
    windowClass?: string;
}

interface IDialogScope extends ng.IScope, IDialogOptions {
    ok(): void
}

interface IConfirmOptions extends IDialogOptions {
    cancelText?: string;
}

interface IConfirmScope extends IDialogScope, IConfirmOptions {
    cancel(): void;
}

interface IProgressOptions {
    title?: string;
    percent: number;
}

interface IProgressScope extends ng.IScope, IProgressOptions {
}

interface IProgressModalInstance extends ng.ui.bootstrap.IModalServiceInstance {
    percent: number;
}

interface IPromptOptions {
    title: string;
    subTitle: string;
    initValue?: string;
    okText?: string;
    cancelText?: string;
}

interface IPromptScope extends ng.IScope, IPromptOptions {
    value: any;
    ok(): void;
    cancel(): void;
}

interface IFileUploadOptions {
    allowedExtensions?: { [index: string]: string };
    sendText?: string;
}

interface IFileUploadScope extends ng.IScope, IFileUploadOptions {
    model: any;
    sendFile(): void;
    dismiss(): void;
}

interface IModalOptions extends ng.ui.bootstrap.IModalSettings {
    controllerUrl: string;
    param: any;
}

interface IDialogs extends IBaseService {
    showDialog(options: IDialogOptions): ng.IPromise<any>;
    showConfirm(options: IConfirmOptions): ng.IPromise<any>;
    showProgress(options: IProgressOptions): IProgressModalInstance;
    showPrompt(options: IPromptOptions): ng.IPromise<any>;
    showFileUpload(options: IFileUploadOptions): ng.IPromise<any>;
    showModal(options: IModalOptions): ng.IPromise<any>;
}

export {IDialogOptions, IDialogScope, IConfirmOptions, IConfirmScope, IProgressOptions, IProgressScope,
IProgressModalInstance, IPromptOptions, IPromptScope, IFileUploadOptions, IFileUploadScope, IModalOptions, IDialogs}