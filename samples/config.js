/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', [ 'pipEntry', 'pipData', 'pipNav', 'pipSettings']);
    // 'pipRest.State', 'pipRest', 'pipData', 'pipDataSettings', 'pipEntry',

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $urlRouterProvider, pipRestProvider, pipAuthStateProvider,
                  pipNavMenuProvider, pipActionsProvider, pipBreadcrumbProvider,
                  pipAppBarProvider, $mdIconProvider, pipSettingsProvider) {

            $mdIconProvider.iconSet('icons', '../lib/images/icons.svg', 512);

            // Set global constants
            pipBreadcrumbProvider.text  = 'Sample Application';
            pipSettingsProvider.showNavIcon(false);
            pipSettingsProvider.showTitleLogo('images/piplife_logo.svg');

            pipActionsProvider.secondaryGlobalActions = [
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ];

            // Configure REST API
            pipRestProvider.serverUrl = 'http://alpha.pipservices.net';

            // Configure default states
            pipSettingsProvider.setDefaultTab('test1');
            pipAuthStateProvider.signinState = 'signin';
            pipAuthStateProvider.signoutState = 'signout';            
            pipAuthStateProvider.unauthorizedState = 'signin';
            pipAuthStateProvider.authorizedState = 'test1';

            $urlRouterProvider.otherwise('/settings/test1');

            // Configure navigation menu
            pipNavMenuProvider.sections = [
                {
                    links: [
                        {title: 'Settings', url: '/settings'}
                    ]
                }, {
                    links: [
                        {title: 'Signout', url: '/signout'}
                    ]
                }
            ];
            pipAppBarProvider.parts = { icon: true, title: 'breadcrumb', actions: 'primary', menu: true };
        }
    );

})(window.angular);

