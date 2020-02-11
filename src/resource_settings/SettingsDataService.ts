import { ISettingsDataService, ISettingsDataProvider } from './ISettingsDataService';
import { ISettingsCacheService, ISettingsCacheProvider } from './ISettingsCacheService';

class SettingsData implements ISettingsDataService {
    private RESOURCE: string = 'partySettings';

    constructor(
        private $rootScope: ng.IRootScopeService,
        private pipRest: pip.rest.IRestService, 
        private pipDataModel: pip.rest.IDataModelService,
        private pipSession: pip.services.ISessionService,
        private pipSettingsCache: ISettingsCacheService
    ) { 
         "ngInject";
    }

    public getUserId(): string {
        let userId: string;
        userId = this.pipSession.session ? this.pipSession.session.userId : null;

        return userId;
    }

    public readSettings(params: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params.resource = this.RESOURCE;
        params.item = params.item || {};
        params.item.party_id = params.item.party_id ? params.item.party_id : this.getUserId();

        return this.pipSettingsCache.readSettings(successCallback, errorCallback)
    }

    public saveSettings(settings: any, keys: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void {
        let params: any = {};
        params.resource = this.RESOURCE;
        params.item = settings;
        params.item.creator_id = params.item.party_id ? params.item.party_id : this.getUserId();

        this.pipDataModel.create(
            params,
            successCallback,
            (error) => {
                this.pipSettingsCache.onSettingsUpdate(settings);

                if (errorCallback) {
                    errorCallback(error);
                }
            }
        )
    }
}

class SettingsDataProvider implements ISettingsDataProvider {
    private _service: ISettingsDataService;

    constructor() { }

    public $get(
        $rootScope: ng.IRootScopeService,
        pipRest: pip.rest.IRestService,
        pipDataModel: pip.rest.IDataModelService,
        pipSession: pip.services.ISessionService,
        pipSettingsCache: ISettingsCacheService
    ) {
        "ngInject";
        
        if (this._service == null) {
            this._service = new SettingsData($rootScope, pipRest, pipDataModel, pipSession, pipSettingsCache);
        }

        return this._service;
    }

}

angular
    .module('pipSettingsData', ['pipCommonRest'])
    .provider('pipSettingsData', SettingsDataProvider);


