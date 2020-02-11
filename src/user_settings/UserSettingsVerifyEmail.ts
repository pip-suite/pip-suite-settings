/**
 * @ngdoc controller
 * @name pipUserSettings.VerifyEmail:UserSettingsVerifyEmailController
 *
 * @description
 * Controller for verify email dialog panel.
 */
export class UserSettingsVerifyEmailController {
    public emailVerified: boolean;
    public data: any; 
    public transaction: pip.services.Transaction;
    public errorsWithHint: any;
    public form: any;

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $mdDialog: angular.material.IDialogService,
        private pipTransaction: pip.services.ITransactionService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipUserData: any, // todo
        private email: string
    ) {

        this.emailVerified = false;
        this.data = {
            email: email,
            code: ''
        };
        this.transaction = pipTransaction.create('settings.verify_email');

        this.errorsWithHint = pipFormErrors.errorsWithHint;
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onAbort
     *
     * @description
     * Aborts a verify request.
     */
    public onAbort() {
        this.transaction.abort();
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onCancel
     *
     * @description
     * Closes opened dialog panel.
     */
    public onCancel() {
        this.$mdDialog.cancel();
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onRequestVerificationClick
     *
     * @description
     * Sends request to verify entered email.
     */
    public onRequestVerificationClick() {
        const tid = this.transaction.begin('RequestEmailVerification');

        this.pipUserData.requestEmailVerification({},
            (result) => {
                if (this.transaction.aborted(tid)) {
                    return;
                }
                this.transaction.end();
            },
            (error) => {
                this.transaction.end(error);
            }
        );
    }

    /**
     * @ngdoc method
     * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onVerify
     *
     * @description
     * Initiates request on verify email on the server.
     */
    public onVerify() {
        this.form.$setSubmitted();

        if (this.form.$invalid) {
            return;
        }
        const tid = this.transaction.begin('Verifying');

        this.pipUserData.verifyEmail({
                email: this.data.email,
                code: this.data.code
            },
            (verifyData) => {
                if (this.transaction.aborted(tid)) {
                    return;
                }
                this.transaction.end();

                this.$mdDialog.hide(true);
            },
            (error) => {
                this.transaction.end(error);

                this.pipFormErrors.setFormError(
                    this.form, error, {
                        1106: 'email',
                        1103: 'code'
                    }
                );
            }
        );
    }
}