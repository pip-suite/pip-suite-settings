export class LANGUAGE {
    static ENGLISH: 'en';
    static SPANISH: 'es';
    static PORTUGUESE: 'pt';
    static FRENCH: 'fr';
    static GERMAN: 'de';
    static RUSSIAN: 'ru';
}

export class EMAIL_TYPE {
    static HOME: 'home';
    static WORK: 'work';
    static OTHER: 'other'
}

export class ADDRESS_TYPE {
    static HOME: 'home';
    static WORK: 'work';
    static OTHER: 'other'
}

export class PHONE_TYPE {
    static MOBILE: 'mobile';
    static WORK: 'work';
    static HOME: 'home';
    static MAIN: 'main';
    static WORK_FAX: 'work fax';
    static HOME_FAX: 'home fax';
    static OTHER: 'other'
}

export class MESSANGER_TYPE {
    static SKYPE: 'skype';
    static GOOGLE_TALK: 'google talk';
    static AIM: 'aim';
    static YAHOO: 'yahoo';
    static QQ: 'qq';
    static MSN: 'msn';
    static ICQ: 'icq';
    static JABBER: 'jabber';
    static OTHER: 'other'
}

export class WEB_ADDRESS_TYPE {
    static PROFILE: 'profile';
    static BLOG: 'blog';
    static HOME_PAGE: 'home page';
    static WORK: 'work';
    static PORTFOLIO: 'portfolio';
    static OTHER: 'other'
}

export interface ISettingsDataService {
    readSettings(params: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveSettings(settings: any, keys: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
}

export interface ISettingsDataProvider extends ng.IServiceProvider {

}