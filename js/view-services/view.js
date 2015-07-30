define(['./module'], function (services) {
    'use strict';
    services.factory('view', ['common', 'viewRow', function (common, viewRow) {
        return function(data, scope, grid){
            this.render = function(){
                var index;
                $(grid).html('');
                var firstView = '';
                for (index = 0; index < this.collection.models.length; ++index) {
                    var childModel = {model: this.collection.models[index]};
                    if(typeof this.addHtmlToChild != 'undefined'){
                        childModel = {model: this.collection.models[index], addHtml: this.addHtmlToChild};
                    }
                    var view = new this.rowview(childModel, scope, grid);
                    view.render();
                    if(index == 0){
                        firstView = view;
                    }
                }
                if(this.collection.models.length > 0){
                    var myInterval = setInterval(function(){
                        if($('#'+firstView.model[firstView.property]).length){
                            common.trigger('viewUsersGrid:render');
                            clearInterval(myInterval);
                        }
                    }.bind(this), 1);
                }
            }
            this.collection = {};
            this.rowview = viewRow;
            this.grid = grid;
            if(typeof data != 'undefined' && data != ''){
                this.rowview = data.rowview;
                this.collection = data.collection;
                if(typeof data.addHtmlToChild != 'undefined' && data.addHtmlToChild != ''){
                    this.addHtmlToChild = data.addHtmlToChild;
                }
                this.collection = data.collection;
                if(common.isPromise(data.collection)){
                    data.collection.done(function(data){
                        this.render();
                    }.bind(this));
                }else{
                    this.render();
                }
            }

        };
    }]);
});
