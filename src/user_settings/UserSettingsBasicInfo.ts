import { UserSettingsChangePasswordController } from './UserSettingsChangePassword';
import { UserSettingsVerifyEmailController } from './UserSettingsVerifyEmail';

{
    interface UserSettingsBasicInfoControllerRootScope extends ng.IRootScopeService {
        $party: any;
        $user: any;
        $theme: any;
    }

    /**
     * @ngdoc controller
     * @name pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
     *
     * @description
     * Controller for the predefined 'basic_info' state.
     * Provides sync changes user's profile with remote profile.
     * On state exit everything is saved on the server.
     */
    class UserSettingsBasicInfoController {
        public originalParty: any;
        public nameCopy: string;
        public loc_pos: any;
        public genders: string[];
        public languages: string[];
        public transaction: pip.services.Transaction;
        public themes: string[];
        public errorsWithHint: any;
        public onChangeUser: any;
        public onChangeBasicInfo: any;
        public picture: any;
        public form: any;
        public message: string;
        public user: any;
        public $user: any;
        public $party: any;
        public $theme: any;

        constructor(
            private $scope: ng.IScope,
            private $rootScope: UserSettingsBasicInfoControllerRootScope,
            private $mdDialog: angular.material.IDialogService,
            private $state: angular.ui.IStateService,
            private $timeout: ng.ITimeoutService,
            private $mdTheming: any,
            private pipTranslate: pip.services.ITranslateService,
            private pipTransaction: pip.services.ITransactionService,
            private pipTheme: pip.themes.IThemeService,
            private pipToasts: pip.controls.IToastService,
            private pipUserData: any,
            private pipPartyData: any,
            private pipFormErrors: pip.errors.IFormErrorsService
        ) {

            try {
                this.originalParty = angular.toJson(this.$rootScope.$party);
            } catch (err) {
                throw err;
            }

            this.nameCopy = this.$rootScope.$party.name;

            $timeout(() => {
                this.loc_pos = this.$rootScope.$party.loc_pos;
            });

            this.genders = pipTranslate.translateSet(['male', 'female', 'n/s'], null, null);
            this.languages = pipTranslate.translateSet(['ru', 'en'], null, null);
            this.$user = this.$rootScope.$user;
            this.$party = this.$rootScope.$party;
            this.$theme =  this.$rootScope.$theme;

            this.transaction = pipTransaction.create('settings.basic_info');

            this.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));

            $state.get('settings.basic_info').onExit = () => { this.saveChanges(); };

            this.errorsWithHint = pipFormErrors.errorsWithHint;
            /** @see updateUser */
            this.onChangeUser = _.debounce(() => { this.updateUser(); }, 2000);
            /** @see saveChanges */
            this.onChangeBasicInfo = _.debounce(() => { this.saveChanges(); }, 2000);

        }

        public onPictureChanged() {
            this.picture.save(
                () => {
                    this.$rootScope.$broadcast('pipPartyAvatarUpdated');
                },
                (error) => {
                    return new Error(error);
                }
            );
        }

        public onPictureCreated($event) {
            this.picture = $event.sender;
            this.picture.save(
                () => {
                    this.$rootScope.$broadcast('pipPartyAvatarUpdated');
                },
                (error) => {
                    return new Error(error);
                }
            );
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeBasicInfo
         *
         * @description
         * Saves changes onto server.
         * This method responses on change of the input information.
         * It is updated user's party profile. Also it updates user's profile in $rootScope.
         */
        private saveChanges() {
            if (this.form) {
                this.form.$setSubmitted();
            }

            if (this.$rootScope.$party) {
                
                if (this.$rootScope.$party.type === 'person' && this.form.$invalid) {
                    return;
                }

                let party;

                // Check to avoid unnecessary savings
                this.$rootScope.$party.loc_pos = this.loc_pos;
                try {
                    party = angular.toJson(this.$rootScope.$party);
                } catch (err) {
                    throw err;
                }

                if (party !== this.originalParty) {
                    const tid = this.transaction.begin('UPDATING');

                    this.pipPartyData.updateParty(this.$rootScope.$party,
                        (data) => {
                            if (this.transaction.aborted(tid)) {
                                return;
                            }
                            this.transaction.end();

                            this.originalParty = party;
                            this.nameCopy = data.name;
                        },
                        (error) => {
                            this.transaction.end(error);
                            this.message = String() + 'ERROR_' + error.status || error.data.status_code;
                            this.$rootScope.$party = angular.fromJson(this.originalParty);
                        }
                    );
                }
            }

        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeUser
         *
         * @description
         * Saves changes onto server.
         * This method responses on change of the user's profile information.
         * Also it updates user's profile in $rootScope.
         */
        private updateUser() {
            const tid = this.transaction.begin('RequestEmailVerification');

            if (this.$rootScope.$user.id === this.$rootScope.$party.id) {
                this.pipUserData.updateUser({
                        item: this.$rootScope.$user
                    },
                    (data) => {
                        if (this.transaction.aborted(tid)) {
                            return;
                        }
                        this.transaction.end();

                        this.pipTranslate.use(data.language);
                        this.$rootScope.$user.language = data.language;
                        this.$rootScope.$user.theme = data.theme;
                        if (this.$rootScope.$user.theme) {
                            this.pipTheme.use(this.$rootScope.$user.theme);
                        }

                    },
                    (error) => {
                        let message;

                        this.transaction.end(error);
                        message = String() + 'ERROR_' + error.status || error.data.status_code;
                        this.pipToasts.showNotification(this.pipTranslate.translate(message), null, null, null, null);
                    }
                );
            }
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangePassword
         *
         * @description
         * It opens a dialog panel to change password.
         *
         * @param {Object} event    Triggered event object
         */
        public onChangePassword(event) {
            this.$mdDialog.show({
                templateUrl: 'user_settings/UserSettingsChangePassword.html',
                controller: UserSettingsChangePasswordController,
                controllerAs: '$ctrl',
                targetEvent: event,
                locals: {
                    email: this.$rootScope.$party.email
                }
            }).then(
                (answer) => {
                    if (answer) {
                        let message = String() + 'RESET_PWD_SUCCESS_TEXT';
                        this.pipToasts.showNotification(this.pipTranslate.translate(message), null, null, null, null);
                    }
                });
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onVerifyEmail
         *
         * @description
         * It opens a dialog panel to change password.
         *
         * @param {Object} event    Triggered event object
         */
        public onVerifyEmail(event) {
            this.$mdDialog.show({
                templateUrl: 'user_settings/UserSettingsVerifyEmail.html',
                controller: UserSettingsVerifyEmailController,
                controllerAs: '$ctrl',
                targetEvent: event,
                locals: {
                    email: this.$rootScope.$party.email
                }
            }).then(
                (answer) => {
                    this.user.email_ver = answer;
                    if (answer) {
                        let message = String() + 'VERIFY_EMAIL_SUCCESS_TEXT';
                        this.pipToasts.showNotification(this.pipTranslate.translate(message), null, null, null, null);
                    }
                }
            );
        }
    }

    const config = function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'basic_info',
            index: 1,
            title: 'SETTINGS_BASIC_INFO_TITLE',
            stateConfig: {
                url: '/basic_info',
                controller: UserSettingsBasicInfoController,
                controllerAs: '$ctrl',
                templateUrl: 'user_settings/UserSettingsBasicInfo.html',
                auth: true
            }
        });

        pipSettingsProvider.setDefaultTab('basic_info');
    };

    angular.module('pipUserSettings.BasicInfo', [
            'pipSettings.Service', 
            'pipSettings.Page'
        ])
        .config(config);
}