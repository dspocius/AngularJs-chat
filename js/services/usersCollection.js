/* FUNCTIONAL INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('usersCollection', ['collection', 'userModel',function (collection, userModel) {
        return function(data){
            var that = collection({model: userModel, data:data});
            that.getModelByProperty = function(property, value){
                var index, i;
                var model = '';
                for (index = 0; index < this.models.length; ++index) {
                   if(this.models[index].get(property) === value){
                       model = this.models[index];
                   }
                }
                return model;
            }
            that.unsetRemoved = function(){
                var index;
                for (index = 0; index < this.models.length; ++index) {
                     this.models[index].removed = false;
                }
            }
            that.removeModels = function(modelsRemove){
                var index, j;
                for (index = 0; index < this.models.length; ++index) {
                    for (j = 0; j < modelsRemove.length; ++j) {
                        if(this.models[index]._id === modelsRemove[j]._id){
                            this.models[index].removed = true;
                        }
                    }
                }
            }
            that.setConnected = function(obj){
                var index, i;
                for (i = 0; i < obj.users.length; ++i) {
                    for (index = 0; index < this.models.length; ++index) {
                        if(this.models[index].get('email') == obj.users[i].name){
                            this.models[index].setConnected(obj.users[i].socket_id);
                        }
                    }
                }
            }
            that.setDisconnected = function(obj){
                var index, i;
                for (index = 0; index < this.models.length; ++index) {
                        this.models[index].removeConnected();
                }
                this.setConnected(obj);
            }
            that.setInFriendsList = function(obj){
                var index, i;
                for (i = 0; i < obj.length; ++i) {
                    for (index = 0; index < this.models.length; ++index) {
                        if(this.models[index].get('email') == obj[i].email){
                            this.models[index].setInFriendsList();
                        }
                    }
                }
            }
            that.url = '/users';
            return that;
        };
    }]);
});
