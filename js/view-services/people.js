define(['./module'], function (services) {
    'use strict';
    services.factory('viewPeople', ['common', function (common) {
        return {
            ui: {
                text:'#homeTextUser',
                messages:'#messagesContainer'
            },
            initializeScopeListening: function (scope) {

            }
        };
    }]);
});
