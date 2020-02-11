import './UserSettingsBasicInfo';
import './UserSettingsBlacklist';
import './UserSettingsContactInfo';
import './UserSettingsSessions';
import './UserSettingsStrings';

angular.module('pipUserSettings', [
    'ngMaterial', 
    'pipCommonRest', 
    'pipPartyData',
    'pipSessionData',
    'pipUserData',
    'pipSettingsData',

    'pipUserSettings.Strings',
    'pipUserSettings.Sessions',
    'pipUserSettings.BasicInfo',
    'pipUserSettings.Blacklist',
    'pipUserSettings.ContactInfo',
    'pipSettings.Templates'
]);