import { ISettingsCacheService, ISettingsCacheProvider } from './ISettingsCacheService';

class SettingsCache implements ISettingsCacheService {
    private RESOURCE: string = 'partySettings'

    constructor(
        private pipTagCache: pip.data.ITagCacheService,
        private pipDataCache: pip.rest.IDataCacheService
    ) {
        "ngInject";
    }

    public readSettings(params: any, successCallback?: (item: any) => void, errorCallback?: (error: any) => void): any {
        params = params || {};
        params.resource = this.RESOURCE;
        params.item = params.item || {};

        return this.pipDataCache.retrieveOrLoad(params, successCallback, errorCallback);
    };

    public onSettingsUpdate(params: any, successCallback?: (item: any) => void): Function {
        return this.pipDataCache.decorateUpdateCallback(
            this.RESOURCE, params,
            this.pipTagCache.tagsUpdateDecorator(params, successCallback)
        );
    };
}

class SettingsCacheProvider implements ISettingsCacheProvider {
    private _service: ISettingsCacheService;

    constructor() { }

    public $get(
        pipTagCache: pip.data.ITagCacheService,
        pipDataCache: pip.rest.IDataCacheService
    ) {
        "ngInject";
        
        if (this._service == null) {
            this._service = new SettingsCache(pipTagCache, pipDataCache);
        }
        return this._service;
    }
}

angular
    .module('pipSettingsCache', ['pipSettingsData'])
    .provider('pipSettingsCache', SettingsCacheProvider);




