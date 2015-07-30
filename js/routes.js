/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';
    app.run(function($location, $rootScope, $route, authentication, api) {
        $rootScope.$on('$locationChangeStart', function(evt, next, current) {
            var nextPath = $location.path(),
                nextRoute = $route.routes[nextPath];
            if (nextRoute && nextRoute.auth && (typeof authentication.logged == 'undefined' || !authentication.logged)) {
                api.getCredentials().success(function(data) {
                    authentication.logged = true;
                    authentication.email = data.username;
                }).error(function(status, data) {
                    $location.path("/login");
                });
            }
        });
    });
    return app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'login'
        });

        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'Home',
            auth: true
        });

        $routeProvider.when('/people', {
            templateUrl: 'partials/people.html',
            controller: 'People',
            auth: true
        });
        $routeProvider.when('/logout', {
            templateUrl: 'partials/login.html',
            controller: 'Logout',
            auth: true
        });
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    }]);
});
