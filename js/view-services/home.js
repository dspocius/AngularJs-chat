define(['./module'], function (services) {
    'use strict';
    services.factory('viewHome', ['common', function (common) {
        return {
            ui: {
                text:'#homeTextUser',
                messages:'#messagesContainer'
            },
            initializeScopeListening: function (scope) {
                scope.sendMessage = function(){
                    var msg = $(this.ui.text).val();
                    common.trigger('send:message',{msg:msg});
                    $(this.ui.text).val('');
                }.bind(this)
            },
            setSelectedUser: function(userModel){
                this.selectedUserModel = userModel;
            },
            getSelectedUser: function(){
                return this.selectedUserModel;
            },
            addMessage: function(msg, from){
                $(this.ui.messages).append('<div>'+from+': '+msg+'</div>');
            },
            addToHeader: function(userGrid, msg){
                $('#'+userGrid+' .bottom').html('<div>'+msg+'</div>');
            },
            changeMessageContentTo: function(userModel){
                $('#'+userModel.get('_id')+' .bottom').html('');
                $(this.ui.messages).html('');
            }
        };
    }]);
});
