define(['./module'], function (services) {
    'use strict';
    services.factory('collection', ['common',function (common) {
        return function(data){
            var collection = {model:function(){}};
            if(typeof data != 'undefined' && data != ''){
                collection = data;
            }
            collection.models = [];
            collection.bindData = function (jsonData, remove_id) {
                var index;
                for (index = 0; index < jsonData.length; ++index) {
                    if(jsonData[index].email != remove_id){
                        this.models.push(new collection.model(jsonData[index]));
                    }
                }
            }
            collection.fetch = function () {
                var remove_id = '';
                if(typeof collection.data != 'undefined' && collection.data != ''
                    && typeof collection.data.rem != 'undefined' && collection.data.rem != '' ){
                    remove_id = collection.data.rem;
                }
                var dfd = $.Deferred();
                common.fetchData(this.url,function(data) {
                    var index;
                    var fixBadJson = JSON.parse(data);
                    var jsonData = JSON.parse(fixBadJson);
                    this.bindData(jsonData, remove_id);
                    /*for (index = 0; index < jsonData.length; ++index) {
                        if(jsonData[index].email != remove_id){
                            this.models.push(new collection.model(jsonData[index]));
                        }
                    }*/
                    dfd.resolve(data);
                }.bind(this),function(status,data){
                    dfd.reject(status,data);
                });
                return dfd.promise();
            }
            return collection;
        };
    }]);
});
