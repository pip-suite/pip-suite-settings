{
    interface SettingsBlacklistControllerRootScope extends ng.IRootScopeService {
        settingsBlacklistInitialized: any;
        $routing: any;
        $party: any;
    }

    class SettingsBlacklistController {
        public transaction: any;
        public blocks: any;
        public message: string;

        constructor(
            private $rootScope: SettingsBlacklistControllerRootScope,
            private pipTransaction: pip.services.ITransactionService,
            private pipConnectionsData: any,
            private $state: angular.ui.IStateService,
            private pipToasts: pip.controls.IToastService
        ) {
            this.$rootScope.settingsBlacklistInitialized = false;
            this.$rootScope.$routing = true;

            this.transaction = pipTransaction.create('settings.blocks');

            this.initialize();
        }

        private initialize() {
            this.pipConnectionsData.readConnectionBlocks({
                    item: {
                        party_id: this.$rootScope.$party.id
                    },
                    force: true
                },
                (data) => {
                    this.blocks = data;
                    this.$rootScope.settingsBlacklistInitialized = true;
                    this.$rootScope.$routing = false;
                },
                (error) => {
                    this.$rootScope.settingsBlacklistInitialized = true;
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

        // Hack for testing
        public onAddBlock() {
            //    pipRest.connectionBlocks().save(
            //        {
            //            party_id: this.party.id,
            //            to_party_id: '5501d3ffa9d7ec7e74d47a72',
            //            to_party_name: 'Name Surname'
            //        }, (data) => {
            //            this.blocks.push(data);
            //        }, (error) => {
            //        });

            this.pipConnectionsData.connectionBlock({
                    party_id: this.$rootScope.$party.id,
                    to_party_id: '5501d3ffa9d7ec7e74d47a72',
                    to_party_name: 'Name Surname'
                },
                (data) => {
                    this.blocks.push(data);
                },
                (error) => {}
            );
        };

        public onRemoveBlock(block) {
            const tid = this.transaction.begin('REMOVING');

            this.pipConnectionsData.deleteConnectionsBlocks({
                    transaction: this.transaction,
                    item: block
                },
                () => {
                    if (this.transaction.aborted(tid)) {
                        return;
                    }
                    this.transaction.end();

                    this.blocks = _.reject(this.blocks,
                        (value: any) => {
                            return value.id == block.id;
                        }
                    );
                },
                (error) => {
                    this.transaction.end(error);
                    this.message = 'ERROR_' + error.status || error.data.status_code;
                    this.pipToasts.showError(this.message, null, null, null, null);
                }
            );
        };
    }

    const config = function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'blacklist',
            index: 2,
            title: 'SETTINGS_BLACKLIST_TITLE',
            stateConfig: {
                url: '/blacklist',
                controller: SettingsBlacklistController,
                controllerAs: '$ctrl',
                templateUrl: 'user_settings/UserSettingsBlacklist.html',
                auth: true
            }
        });
    }

    angular.module('pipUserSettings.Blacklist', [])
        .config(config);
}