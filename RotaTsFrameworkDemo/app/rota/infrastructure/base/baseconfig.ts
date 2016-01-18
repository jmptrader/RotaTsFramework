interface IBaseConfig {
}

interface IBaseConfigProvider<TConfig extends IBaseConfig> {
    configure(config: TConfig): void;
}

class BaseConfig<TConfig extends IBaseConfig> implements ng.IServiceProvider, IBaseConfigProvider<TConfig> {

    config: TConfig;

    constructor() {
        this.configure(this.config);
    }

    configure(config: TConfig): void {
        this.config = config;
    }

    $get(): TConfig {
        return this.config;
    }
}
//Export
export { BaseConfig, IBaseConfigProvider, IBaseConfig}