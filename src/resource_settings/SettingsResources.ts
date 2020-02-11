

function configSettingsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions

    pipRestProvider.registerPartyCollection('partySettings', '/api/parties/:party_id/settings');
}

angular
    .module('pipSettingsData')
    .config(configSettingsResources);
