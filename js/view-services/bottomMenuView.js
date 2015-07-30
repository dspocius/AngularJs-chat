/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('bottomMenuView', ['common', 'viewRow', function (common, viewRow) {
        return function(data, scope){
            var thisView = function(){
                this.ui = {
                    footerNavCenter: '#footer-nav-center ul',
                    footerNavLeft: '#footer-nav-left ul',
                    footerNavRight: '#footer-nav-right ul'
                };
                scope.leftMenuClick = function(itemName){
                    common.trigger('left:menu:click',{name:itemName});
                }
                this.footerNavCenter = [];
                this.initializeDefaultMenu = function(active){
                    var homeAdd = '';
                    var peopleAdd = '';
                    if(active == 'Home'){ homeAdd = 'class="active"'; }
                    if(active == 'People'){ peopleAdd = 'class="active"'; }
                    $('.active').removeClass('active');
                    $('#'+active).addClass('active');
                    this.addMenuFooterCenter({mel:homeAdd, linktext:'#/home',glyphicon:'glyphicon-home',name:'Home'});
                    this.addMenuFooterCenter({mel:peopleAdd, linktext:'#/people',glyphicon:'glyphicon-list-alt',name:'People'});
                }
                this.setToDefault = function(){
                    $(this.ui.footerNavLeft).html('');
                    $(this.ui.footerNavCenter).html('');
                    $(this.ui.footerNavRight).html('');
                }
                this.addMenuFooterCenter = function(model){
                    this.footerNavCenter.push(model);
                    var html = this.htmlTemplate(model);
                    model._id = model.name;
                    var el = '';
                    if(typeof model.mel != 'undefined'){
                        el = model.mel;
                    }
                    this.renderHtmlInParent(html,model,this.ui.footerNavCenter,el,'li');
                }
                this.htmlTemplate = function(model){
                    var html = '';
                    if(typeof model.button != 'undefined'){
                        var inHtml = '<div class="glyphicon '+model.button+' icon-in-menu icon-turn-off" aria-hidden="true"></div>';
                        html = '<button ng-click="leftMenuClick('+"'"+model.name+"'"+')" id="menitem">'+inHtml+'</button>';
                    }
                    if(typeof model.link != 'undefined'){
                        html = '<a href="'+model.link+'">'+model.name+'</a>';
                    }
                    if(typeof model.div != 'undefined'){
                        var glyph = '';
                        if(typeof model.glyphicon != 'undefined'){
                            glyph = '<div ng-click="leftMenuClick('+"'"+model.name+"'"+')" class="glyphicon '+model.glyphicon+' icon-in-menu icon-turn-off" aria-hidden="true"></div>';
                        }
                        html = '<div id="'+model.div+'">'+glyph+'</div>';
                    }
                    if(typeof model.linktext != 'undefined'){
                        var glyph = '';
                        var itemText = '';
                        if(typeof model.glyphicon != 'undefined'){
                            glyph = '<div class="glyphicon '+model.glyphicon+' icon-in-menu icon-turn-off" aria-hidden="true"></div>';
                        }
                        if(typeof model.name != 'undefined'){
                            itemText = '<div>'+model.name+'</div>';
                        }
                        html = '<a href="'+model.linktext+'">'+glyph+itemText+'</a>';
                    }
                    return html;
                }
            };
            thisView.prototype = new viewRow(data, scope, '');
            thisView.prototype.constructor=thisView;
            return new thisView();
        }
    }]);
});
