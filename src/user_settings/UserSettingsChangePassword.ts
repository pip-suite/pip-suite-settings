/**
 * @ngdoc controller
 * @name pipUserSettings.ChangePassword:UserSettingsChangePasswordController
 *
 * @description
 * Controller for dialog panel of password change.
 */
export class UserSettingsChangePasswordController {
    public transaction: pip.services.Transaction;
    public showRepeatHint: boolean;
    public changePasData: any;
    public errorsWithHint: any;
    public errorsRepeatWithHint: any;
    public repeat: string;
    public form: any;

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $mdDialog: angular.material.IDialogService,
        private email: string,
        private pipUserData: any,
        private pipTransaction: pip.services.ITransactionService,
        private pipFormErrors: pip.errors.IFormErrorsService
    ) {

        this.transaction = pipTransaction.create('settings.change_password');
        this.errorsRepeatWithHint = (form, formPart) => {
            if (this.showRepeatHint) {
                return pipFormErrors.errorsWithHint(formPart);
            }

            return {};
        };
        this.showRepeatHint = true;
        this.changePasData = {};
        this.errorsWithHint = pipFormErrors.errorsWithHint;
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
     * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onCancel
     *
     * @description
     * Closes opened dialog panel.
     */
    public onCancel() {
        this.$mdDialog.cancel();
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
     * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onCheckRepeatPassword
     *
     * @description
     * Validates a password typed into password fields.
     */
    public onCheckRepeatPassword() {
        if (this.changePasData) {
            if (this.repeat === this.changePasData.new_password || this.repeat === '' || !this.repeat) {
                this.form.repeat.$setValidity('repeat', true);
                if (this.repeat === this.changePasData.new_password) {
                    this.showRepeatHint = false;
                } else {
                    this.showRepeatHint = true;
                }
            } else {
                this.showRepeatHint = true;
                this.form.repeat.$setValidity('repeat', false);
            }
        }
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
     * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onApply
     *
     * @description
     * Approves password change and sends request to the server on password change.
     */
    public onApply() {
        this.onCheckRepeatPassword();

        if (this.form.$invalid) {
            return;
        }

        if (!this.transaction.begin('CHANGE_PASSWORD')) {
            return;
        }

        this.changePasData.email = this.email;

        this.pipUserData.changePassword(
            this.changePasData,
            () => {
                this.transaction.end();
                this.$mdDialog.hide(true);
            },
            (error) => {
                this.transaction.end(error);
                this.pipFormErrors.setFormError(
                    this.form, error, {
                        1107: 'oldPassword',
                        1105: 'newPassword'
                    }
                );
            }
        );
    }
}