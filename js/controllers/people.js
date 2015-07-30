define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('People', ['common', '$scope', '$location', 'viewPeople', 'usersCollection','viewUsersGrid', 'socketService','authentication','topMenuView','bottomMenuView','userModel',
        function (common, $scope, $location, viewPeople, usersCollection, viewUsersGrid, socketService, authentication, topMenuView, bottomMenuView, userModel) {
            viewPeople.initializeScopeListening($scope);
            var users, friendsRequests, friendsCol;
            var auth = new authentication();
            var topMView = new topMenuView('',$scope);
            topMView.initializeDefaultMenu();
            topMView.initializeScopeListening();
            var bottomMView = new bottomMenuView('',$scope);
            bottomMView.initializeDefaultMenu('People');
            this.initializeUsersView = function(data){
                $('#peopleV #usersGridView').html('');
                friendsRequests = new usersCollection();
                friendsCol = new usersCollection();
                var requestsList = data.friends.filter(function(el){ return !el.approved; });
                var friendsList = data.friends.filter(function(el){ return el.approved; });
                friendsCol.bindData(friendsList);
                friendsRequests.bindData(requestsList);
                var gridViewFriendsList = new viewUsersGrid({collection: friendsCol, addHtmlToChild:'<div ng-click="addUserClick('+"'"+'{_id}'+"'"+')" id="user_add" class="glyphicon glyphicon-minus icon-in-menu icon-turn-off user-add"></div>'}, $scope,'#peopleV #friendsGridView');
                var gridViewReq = new viewUsersGrid({collection: friendsRequests, addHtmlToChild:'<div ng-click="acceptClick('+"'"+'{_id}'+"'"+')" class="glyphicon glyphicon-ok icon-in-menu icon-turn-off user-accept"></div> <div ng-click="addUserClick('+"'"+'{_id}'+"'"+')" id="user_add" class="glyphicon glyphicon-minus icon-in-menu icon-turn-off user-add"></div>'}, $scope,'#peopleV #requestsGridView');

                if(typeof usersCollection.loadedUsers != 'undefined'){
                    users = usersCollection.loadedUsers;
                    users.unsetRemoved();
                    users.removeModels(requestsList);
                    users.removeModels(friendsList);
                    var gridView = new viewUsersGrid({collection: users, addHtmlToChild:'<div ng-click="addUserClick('+"'"+'{_id}'+"'"+')" id="user_add" class="glyphicon glyphicon-plus icon-in-menu icon-turn-off user-add"></div>'}, $scope, '#peopleV #usersGridView');
                }else{
                    users = new usersCollection({rem:data.email});
                    users.fetch().done(function(){
                        usersCollection.loadedUsers = users;
                        users.unsetRemoved();
                        users.removeModels(requestsList);
                        users.removeModels(friendsList);
                        var gridView = new viewUsersGrid({collection: users, addHtmlToChild:'<div ng-click="addUserClick('+"'"+'{_id}'+"'"+')" id="user_add" class="glyphicon glyphicon-plus icon-in-menu icon-turn-off user-add"></div>'}, $scope, '#peopleV #usersGridView');
                    });
                }
            };
            $scope.acceptClick = function(userID){
                var getModel2 = authentication.connectedUser;
                getModel2.url = '/updateuser';
                getModel2.friendApprove = userID;
                var promise2 = getModel2.save(['email','friendApprove']);
                $.when( promise2 ).then(function() {
                    $('#'+userID+' .glyphicon-ok').remove();
                    auth.reconnectUser();
                });
            }
            $scope.addUserClick = function(userID){
                var getModel2 = authentication.connectedUser;
                var getModel = usersCollection.loadedUsers.getModelByProperty('_id',userID);
                getModel.url = '/updateuser';
                getModel2.url = '/updateuser';
                var wasnot_plus = true;
                if($('#'+userID+' #user_add').hasClass('glyphicon-plus')){
                    getModel.friends = [{_id:getModel2._id, email:getModel2.email, firstname:getModel2.firstname,
                        lastname:getModel2.lastname, approved: false}];
                    getModel2.friends = [{_id:getModel._id, email:getModel.email, firstname:getModel.firstname,
                        lastname:getModel.lastname, approved: true}];
                    var promise = getModel.save(['email','friends']);
                    var promise2 = getModel2.save(['email','friends']);
                    $('#'+userID+' #user_add').removeClass('glyphicon-plus');
                    $('#'+userID+' #user_add').addClass('glyphicon-refresh');
                    $.when( promise, promise2 ).then(function() {
                        $('#'+userID+' #user_add').removeClass('glyphicon-refresh');
                        $('#'+userID+' #user_add').addClass('glyphicon-minus');
                        socketService.sendUpdate(getModel,{addFriend:getModel.friends});
                    });
                    wasnot_plus = false;
                }
                if($('#'+userID+' #user_add').hasClass('glyphicon-minus') && wasnot_plus){
                    getModel.removeFriends = [{_id:getModel2._id, email:getModel2.email, firstname:getModel2.firstname,
                        lastname:getModel2.lastname, approved: false}];
                    getModel2.removeFriends = [{_id:getModel._id, email:getModel.email, firstname:getModel.firstname,
                        lastname:getModel.lastname, approved: true}];
                    var promise = getModel.save(['email','removeFriends']);
                    var promise2 = getModel2.save(['email','removeFriends']);

                    $('#'+userID+' #user_add').removeClass('glyphicon-minus');
                    $('#'+userID+' .user_add').addClass('glyphicon-refresh');
                    $.when( promise, promise2, auth.reconnectUser() ).then(function() {
                        if($('#'+userID+' .glyphicon-ok').length){
                            $('#'+userID+' .glyphicon-ok').remove();
                        }
                        $('#'+userID+' #user_add').removeClass('glyphicon-refresh');
                        $('#'+userID+' #user_add').addClass('glyphicon-plus');
                        socketService.sendUpdate(getModel,{removeFriend:getModel.removeFriends});
                        authentication.connectedUser.friends = common.removeArrayEl(authentication.connectedUser.friends, getModel2.removeFriends);
                        this.initializeUsersView(authentication.connectedUser);
                    }.bind(this));
                }
            }.bind(this)
            auth.connectedUser(this.initializeUsersView);

           /* $scope.$on('user:change', function(event, userModel) { });
            $scope.$on('user:add', function(event, userModel) { });
            socketService.on('chat message', function(obj){ });*/
            if(typeof socketService.connected != 'undefined'){
                common.trigger('viewUsersGrid:render');
            }
            this.listenTo = function(){
                $scope.$on('viewUsersGrid:render', function(event) {
                    if(typeof socketService.connected != 'undefined' && typeof users != 'undefined' && users.models.length > 0 &&
                        $('#'+users.models[0]._id).length){
                        users.setConnected(socketService.connected);
                        auth.connectedUser(function(data){ users.setInFriendsList(data.friends); });
                    }
                });
            }
            this.listenToOnce = function(){
                viewPeople.listenToOnceInit = true;
                socketService.on('update', function(obj){
                    authentication.connectedUser.friends = common.addToArrayEl(authentication.connectedUser.friends, obj.addFriend);
                    authentication.connectedUser.friends = common.removeArrayEl(authentication.connectedUser.friends, obj.removeFriend);
                    this.initializeUsersView(authentication.connectedUser);
                }.bind(this));
                socketService.on('user_disconnected', function(obj){
                    socketService.connected = obj;
                    users.setDisconnected(obj);
                });
                socketService.on('user_connected', function(obj){
                    socketService.connected = obj;
                    common.trigger('viewUsersGrid:render');
                });
            }
            if(typeof viewPeople.listenToOnceInit === 'undefined' && !viewPeople.listenToOnceInit){
                this.listenToOnce();
            }
            this.listenTo();
        }]);
});
