define(['./module'], function (services) {
    'use strict';
    services.factory('socketService', ['$rootScope','authentication',function ($rootScope,authentication) {
        var socket = io.connect();
        var auth = new authentication();
        auth.checkLogin(function(data){
            socket.emit('clientconnected', {id:data});
        });
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            sendUpdate: function(model, obj){
                if(typeof model.socketID != 'undefined' && model.socketID != ''){
                    this.emit('update',{obj:obj, to:model.socketID});
                }
            }
        };
    }]);
});
