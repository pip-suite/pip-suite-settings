/**
 * @file Sample application to provide end-to-end example of WebUI
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSample', [
        // 3rd Party Modules
        'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
        'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'ngAnimate',
        // Application Configuration must go first
        'pipSettingsConfig', 'pipSampleConfig',
        // Modules from WebUI Framework
        'pipControls', 'pipLayout', 'pipNav', 'pipEntry', 'pipData', 'pipCommonRest',
        // Sample Application Modules
        'pipSettings'
    ]);

    thisModule.controller('pipSampleController',
        function () {
            // Sample controller code here...
        }
    );

})(window.angular);

