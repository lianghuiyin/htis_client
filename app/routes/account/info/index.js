import Ember from 'ember';

export default Ember.Route.extend({
    controllerName: 'account.info',
    renderTemplate: function(controller) {
        this.render('account/info',{ outlet: 'account/info',controller: controller });
    },
    activate:function(){
        var controller = this.controllerFor("account/info");
        controller.set("isEditing",false);
        return this;
    },
    actions:{
        goEdit:function(){
            this.transitionTo('account.info.edit');
        }
    }
});
