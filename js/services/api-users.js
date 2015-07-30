define(['./module'], function (services) {
    'use strict';
    services.factory('api', ['$http', function ($http) {
        return {
            login: function(email, password) {
                return $http.post('/login', {email: email, password: password});
            },
            getCredentials: function () {
                return $http.get('/checkifuserloggedin');
            },
            getUsers: function () {
                return $http.get('/users');
            },
            logout: function() {
                return $http.delete('/logout');
            },
            setFriends: function(friends){
                return $http.put('/user/update',{friends:friends});
            }
        };
    }]);
});
