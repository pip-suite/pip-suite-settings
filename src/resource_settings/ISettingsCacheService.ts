
export interface ISettingsCacheService {
    readSettings(params: any, successCallback?: (item: any) => void, errorCallback?: (error: any) => void): any;
    onSettingsUpdate(params: any, successCallback?: (item: any) => void): Function;
}

export interface ISettingsCacheProvider extends ng.IServiceProvider {

}
