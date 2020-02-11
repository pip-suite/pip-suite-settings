(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSettingsConfig', ['pipSettings']);
    
    thisModule.config(function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'test1',
            title: 'Test1 settings tab',
            auth: true,
            stateConfig: {
                url: '/settings/test1',
                templateUrl: 'settings_tab.html'
            }
        });
        pipSettingsProvider.addTab({
            state: 'test2',
            title: 'Test2 settings tab',
            auth: true,
            stateConfig: {
                url: '/settings/test2',
                template: 'test2'
            }
        });
    });

})(window.angular);