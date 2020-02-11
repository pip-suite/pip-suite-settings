{
    interface SettingsContactInfoControllerRootScope extends ng.IRootScopeService {
        settingsContactInfoInitialized: any;
        $routing: any;
        $party: any;
        $user: any;
    }

    class SettingsContactInfoController {
        public transaction: pip.services.Transaction;
        public contact: any;
        public originalContact: any;
        public $avatarReset: any;
        public picture: any;
        public newPhoneType: string;
        public showPhoneAddBlock: boolean;
        public newPhone: string;
        public newEmailType: string;
        public showEmailAddBlock: boolean;
        public newEmail: string;
        public newAddressType: string;
        public showAddressAddBlock: boolean;
        public newAddress: string;
        public newAccountType: string;
        public showAccountAddBlock: boolean;
        public newAccount: string;
        public newWebsiteType: string;
        public showWebsiteAddBlock: boolean;
        public newWebsite: string;

        public emailTypes: string[];
        public phoneTypes: string[];
        public addressTypes: string[];
        public imsTypes: string[];
        public websiteTypes: string[];

        public $party: any;
        public $user: any;

        constructor(
            private $rootScope: SettingsContactInfoControllerRootScope,
            private pipTranslate: pip.services.ITranslateService,
            pipEnums: any,
            private pipToasts: pip.controls.IToastService,
            private pipContactsData: any,
            private $state: angular.ui.IStateService,
            pipTransaction: pip.services.ITransactionService
        ) {
            this.$rootScope.settingsContactInfoInitialized = false;
            this.$rootScope.$routing = true;
            this.$party = $rootScope.$party;
            this.$user = $rootScope.$user;

            this.emailTypes = pipTranslate.translateSet(pipEnums.EMAIL_TYPES, null, null);
            this.phoneTypes = pipTranslate.translateSet(pipEnums.PHONE_TYPES, null, null);
            this.addressTypes = pipTranslate.translateSet(pipEnums.ADDRESS_TYPES, null, null);
            this.imsTypes = pipTranslate.translateSet(pipEnums.MESSANGER_TYPES, null, null);
            this.websiteTypes = pipTranslate.translateSet(pipEnums.WEB_ADDRESS_TYPES, null, null);

            this.transaction = pipTransaction.create('contact_info.update');
            this.initialize();
        }


        private initialize() {
            this.pipContactsData.readContacts({
                    item: {
                        party_id: this.$rootScope.$party.id
                    }
                },
                (contacts) => {
                    this.contact = contacts.name ? contacts : this.createEmptyContacts();
                    this.originalContact = angular.toJson(this.contact);
                    this.$avatarReset = false;

                    this.$rootScope.settingsContactInfoInitialized = true;
                    this.$rootScope.$routing = false;
                },
                (error) => {
                    this.$rootScope.settingsContactInfoInitialized = true;
                    this.$rootScope.$routing = false;
                    // no connection error
                    if (error && (error.status === -1 || error.code === -1)) {
                        this.$state.go('errors_no_connection', {
                            error: error
                        });
                    } else { // unknown error
                        this.$state.go('errors_unknown', {
                            error: error
                        });
                    }
                }
            );
        }

        //-----------------------------

        public onPictureCreated($event) {
            this.picture = $event.sender;
            this.picture.save(
                // Success callback
                () => {},
                // Error callback
                (error) => {}
            );
        };

        public onPictureChanged($control) {
            this.picture.save(
                // Success callback
                () => {},
                // Error callback
                (error) => {}
            );
        };

        private createEmptyContacts() {
            this.pipContactsData.createContacts({
                    transaction: this.transaction,
                    item: {
                        party_id: this.$rootScope.$party.id,
                        for_party_id: this.$rootScope.$party.id,
                        name: this.$rootScope.$party.name
                    }
                },
                (savedContact) => {
                    this.contact = savedContact;
                    this.originalContact = angular.toJson(this.contact);
                    return this.contact;
                },
                (error) => {
                    const message = 'ERROR_' + error.status || error.data.status_code;
                    this.pipToasts.showError(message, null, null, null, null);
                    this.contact = angular.fromJson(this.originalContact);
                }
            );
        };

        public onAddPhone(newPhone) {
            if (newPhone == undefined || newPhone == '') return;

            if (!this.contact.phones)
                this.contact.phones = [];
            this.contact.phones.push({
                type: (this.newPhoneType) ? this.newPhoneType : 'mobile',
                number: newPhone
            });

            this.showPhoneAddBlock = false;
            this.newPhoneType = 'mobile';
            this.newPhone = '';
            this.onSaveChanges('phones', 0, 'number');
        };

        public onAddEmail(newEmail) {
            if (newEmail == undefined || newEmail == '') return;

            if (!this.contact.emails)
                this.contact.emails = [];

            this.contact.emails.push({
                type: (this.newEmailType) ? this.newEmailType : 'home',
                email: newEmail
            });

            this.showEmailAddBlock = false;
            this.newEmailType = 'home';
            this.newEmail = '';
            this.onSaveChanges('emails', 0, 'email');
        };

        public onAddAddress(newAddress) {
            if (newAddress == undefined || newAddress == '') return;

            if (!this.contact.addresses)
                this.contact.addresses = [];

            this.contact.addresses.push({
                type: (this.newAddressType) ? this.newAddressType : 'home',
                address: newAddress
            });

            this.showAddressAddBlock = false;
            this.newAddressType = 'home';
            this.newAddress = '';
            this.onSaveChanges('addresses', 0, 'address');
        };

        public onAddAccount(newAccount) {
            if (newAccount == undefined || newAccount == '') return;

            if (!this.contact.ims)
                this.contact.ims = [];

            this.contact.ims.push({
                type: (this.newAccountType) ? this.newAccountType : 'skype',
                user: newAccount
            });

            this.showAccountAddBlock = false;
            this.newAccountType = 'skype';
            this.newAccount = '';
            this.onSaveChanges('ims', 0, 'user');
        };

        public onAddWebsite(newWebsite) {
            if (newWebsite == undefined || newWebsite == '') return;

            if (!this.contact.websites)
                this.contact.websites = [];

            this.contact.websites.push({
                type: (this.newWebsiteType) ? this.newWebsiteType : 'profile',
                url: newWebsite
            });

            this.showWebsiteAddBlock = false;
            this.newWebsiteType = 'home';
            this.newWebsite = '';
            this.onSaveChanges('websites', 0, 'url');
        };

        public onSaveChanges(contactListName, index, contactElementName) {
            if (this.contact[contactListName][index][contactElementName] == '') {
                this.contact[contactListName].splice(index, 1);
            }

            var contact = angular.toJson(this.contact);

            if (contact != this.originalContact) {
                this.originalContact = contact;
                this.pipContactsData.updateContact({
                        transaction: this.transaction,
                        item: this.contact
                    },
                    () => {
                        // Do nothing
                    },
                    (error) => {
                        var message = 'ERROR_' + error.status || error.data.status_code;
                        this.pipToasts.showError(message, null, null, null, null);
                    }
                );
            }
        };
    }
}

const config = function (pipSettingsProvider) {
    pipSettingsProvider.addTab({
        state: 'contact_info',
        index: 1,
        title: 'SETTINGS_CONTACT_INFO_TITLE',
        stateConfig: {
            url: '/contact_info',
            controller: 'pipSettingsContactInfoController',
            templateUrl: 'settings/settings_contact_info.html',
            auth: true
        }
    });
};

angular.module('pipUserSettings.ContactInfo', [])
    .config(config);
