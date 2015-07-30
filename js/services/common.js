/*
FUNCTION:
 broadcastChange
 CONTROLLER:
 $scope.$watch(function () {
 return viewLogin.tags;
 },
 function(newVal, oldVal) {
 console.log(newVal);
 console.log(oldVal);
 }, true);
 SERVICE:
 common.broadcastChange(function(){
 this.tags.a = true;
 }.bind(this));
 * */
define(['./module'], function (services) {
    'use strict';
    services.factory('common', ['$rootScope', '$http',function ($rootScope, $http) {
        return {
            broadcastChange: function(f){
                if($rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest'){
                    $rootScope.$apply(function() {
                        f();
                    }.bind(this));
                }
                else {
                    f();
                }
            },
            trigger: function(name,obj){
                $rootScope.$broadcast(name, obj);
            },
            fetchData: function(name, onSuccessCallback, onFailCallback){
                $http.get(name).success(function(data) {
                    onSuccessCallback(data);
                }).error(function(status, data) {
                    this.locateToLogin();
                    onFailCallback(status,data);
                }.bind(this));
            },
            isPromise: function(value) {
                if (typeof value.then !== "function") {
                    return false;
                }
                var promiseThenSrc = String($.Deferred().then);
                var valueThenSrc = String(value.then);
                return promiseThenSrc === valueThenSrc;
            },
            locateToLogin: function(){
                window.location = '#/login';
            },
            removeArrayEl: function(array, removeArr){
                if(typeof removeArr != 'undefined' && removeArr != ''){
                    var newFriendList = [];
                    for(var i=0; i < array.length; i++){
                        var canAdd = true;
                        for(var j=0; j < removeArr.length; j++){
                            if(array[i]._id == removeArr[j]._id){
                                canAdd = false;
                            }
                        }
                        if(canAdd){
                            newFriendList.push(array[i]);
                        }
                    }
                    array = newFriendList;
                }
                return array;
            },
            addToArrayEl: function(array, addArr){
                if(typeof addArr != 'undefined' && addArr != ''){
                    for(var i=0; i < addArr.length; i++){
                        var canAdd = true;
                        for(var j=0; j < array.length; j++){
                            if(addArr[i]._id == array[j]._id){
                                canAdd = false;
                            }
                        }
                        if(canAdd){
                            array.push(addArr[i]);
                        }
                    }
                }
                return array;
            }
        };
    }]);
});
