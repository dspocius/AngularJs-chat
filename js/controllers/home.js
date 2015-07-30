define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Home', ['common', '$scope', '$location', 'viewHome', 'usersCollection','viewUsersGrid', 'socketService','authentication','topMenuView','bottomMenuView',
        function (common, $scope, $location, viewHome, usersCollection, viewUsersGrid, socketService, authentication, topMenuView, bottomMenuView) {
        var users;
        var auth = new authentication();
        viewHome.initializeScopeListening($scope);
        viewHome.setSelectedUser('');
        var topMView = new topMenuView('',$scope);
        topMView.initializeDefaultMenu();
        topMView.initializeScopeListening();
        var bottomMView = new bottomMenuView('',$scope);
        bottomMView.initializeDefaultMenu('Home');
        auth.connectedUser(function(data){
            users = new usersCollection();
            var friendsList = data.friends.filter(function(el){ return el.approved; });
            users.bindData(friendsList);
            var gridView = new viewUsersGrid({collection: users}, $scope);
            if(friendsList.length == 0){
                $(gridView.grid).html('You have no friends added yet');
                $('.sendButton').attr('disabled','disabled');
            }else{
                $('.sendButton').removeAttr('disabled');
            }
        });

            if(typeof socketService.connected != 'undefined'){
                common.trigger('viewUsersGrid:render');
            }
        this.listenTo = function(){
            $scope.$on('viewUsersGrid:render', function(event) {
                if(typeof socketService.connected != 'undefined' && typeof users != 'undefined' && users.models.length > 0 &&
                    $('#'+users.models[0]._id).length){
                    users.setConnected(socketService.connected);
                    if(users.models.length != 0 && viewHome.getSelectedUser() == ''){
                        users.models[0].setChosen();
                    }
                }
            });

            $scope.$on('user:change', function(event, userModel) {
                $(".selectedUser").removeClass('selectedUser');
                $("#"+userModel._id).addClass('selectedUser');
                viewHome.changeMessageContentTo(userModel);
                viewHome.setSelectedUser(userModel);
            });
            $scope.$on('send:message', function(event, obj) {
                if(obj.msg != ''){
                    viewHome.addMessage(obj.msg, authentication.email);
                    if(typeof viewHome.getSelectedUser().socketID != 'undefined' && viewHome.getSelectedUser().socketID != ''){
                        socketService.emit('chat message',{from:authentication.email, to:viewHome.getSelectedUser().socketID,msg:obj.msg});
                    }
                }
            });
        }
        this.listenToOnce = function(){
            viewHome.listenToOnceInit = true;
            socketService.on('user_disconnected', function(obj){
                socketService.connected = obj;
                users.setDisconnected(obj);
            });
            socketService.on('user_connected', function(obj){
                socketService.connected = obj;
                common.trigger('viewUsersGrid:render');
            });
            socketService.on('chat message', function(obj){
                if(viewHome.getSelectedUser().get('email') === obj.from){
                    viewHome.addMessage(obj.msg, obj.from);
                }else{
                    var getModel = users.getModelByProperty('email',obj.from);
                    viewHome.addToHeader(getModel.get('_id'), obj.msg);
                }
            });
        }
            if(typeof viewHome.listenToOnceInit === 'undefined' && !viewHome.listenToOnceInit){
                this.listenToOnce();
            }
            this.listenTo();
    }]);
});
