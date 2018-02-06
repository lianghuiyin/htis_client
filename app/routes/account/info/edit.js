import Ember from 'ember';

export default Ember.Route.extend({
    controllerName: 'account.info',
    renderTemplate: function(controller) {
        this.render('account/info',{ outlet: 'account/info',controller: controller });
    },
    activate:function(){
        var controller = this.controllerFor("account/info");
        controller.set("isEditing",true);
        return this;
    },
    deactivate:function(){
        var controller = this.controller;
        var model = controller.get("model");
        if(model){
            model.rollbackAttributes();
        } 
        return this;
    },
    actions:{
        goIndex:function(){
            this.transitionTo('account.info.index');
        }
    }
});
