/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('viewUsersGrid', ['common', 'view', 'viewUsersGridRow', function (common, view, viewUsersGridRow) {
        return function(data, scope, grid){
            var viewUsersGrid = function(){
            };
            data.rowview = viewUsersGridRow;
            var gridId = '#usersGridView';
            if(typeof grid != 'undefined' && grid != ''){
                gridId = grid;
            }
            viewUsersGrid.prototype = new view(data, scope, gridId);
            viewUsersGrid.prototype.constructor=viewUsersGrid;
            return new viewUsersGrid();
        }
    }]);
});
