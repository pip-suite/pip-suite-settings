{
    /**
     * @ngdoc controller
     * @name pipUserSettings.Sessions:pipUserSettingsSessionsController
     *
     * @description
     * Controller provides an interface for managing active sessions.
     */
    class UserSettingsSessionsController {
        public transaction: pip.services.Transaction;
        public message: string;

        constructor(
            pipTransaction: pip.services.ITransactionService,
            private pipSessionData: any, // todo
            public sessions,
            public sessionId
        ) {
            this.sessionId = sessionId;
            this.transaction = pipTransaction.create('settings.sessions');
            this.sessions = sessions;
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
         * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemoveAll
         *
         * @description
         * Closes all active session.
         */
        public onRemoveAll() {
            const tid = this.transaction.begin('REMOVING');

            async.eachSeries(
                this.sessions,
                (session: any, callback) => {
                    if (session.id == this.sessionId) {
                        callback();
                    } else {
                        this.pipSessionData.removeSession({
                                session: session
                            },
                            () => {
                                this.sessions = _.without(this.sessions, session);
                                callback();
                            },
                            (error) => {
                                callback;
                            }
                        );
                    }
                },
                (err) => {
                    if (err) {
                        this.transaction.end(err);
                    }
                    if (this.transaction.aborted(tid)) {
                        return;
                    }
                    this.transaction.end();
                });
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
         * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemove
         *
         * @description
         * Closes passed session.
         *
         * @param {Object} session  Session configuration object
         */
        public onRemove(session, callback) {
            if (session.id === this.sessionId) {
                return;
            }
            const tid = this.transaction.begin('REMOVING');
            this.pipSessionData.removeSession({
                    session: session
                },
                () => {
                    if (this.transaction.aborted(tid)) {
                        return;
                    }
                    this.transaction.end();

                    this.sessions = _.without(this.sessions, session);
                    if (callback) {
                        callback();
                    }
                },
                (error) => {
                    this.transaction.end(error);
                    this.message = 'ERROR_' + error.status || error.data.status_code;
                }
            );
        }
    }

    const config = function (pipSettingsProvider, pipSessionDataProvider) {
        pipSettingsProvider.addTab({
            state: 'sessions',
            index: 3,
            title: 'SETTINGS_ACTIVE_SESSIONS_TITLE',
            stateConfig: {
                url: '/sessions',
                controller: UserSettingsSessionsController,
                templateUrl: 'user_settings/UserSettingsSessions.html',
                controllerAs: '$ctrl',
                auth: true,
                resolve: {
                    sessions: pipSessionDataProvider.readSessionsResolver,
                    sessionId: pipSessionDataProvider.readSessionIdResolver
                }
            }
        });
    };

    angular.module('pipUserSettings.Sessions', [
            'pipSettings.Service', 'pipSettings.Page',
        ])
        .config(config);
}