import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function(controller) {
        this.render('setting/users/user/resetpwd', { into:'setting/users',  controller: controller});
    },
    model() {
        var curUserId = this.paramsFor("setting.users.user").id;
        return this.store.createRecord('resetpwd',{
            user: curUserId
        });
    },
    deactivate(){
        var controller = this.controller;
        var model = controller.get("model");
        if(model){
            model.rollbackAttributes();
        }
        return this;
    },
    actions:{
        goIndex:function(){
            this.transitionTo('setting.users.user');
        }
    }
});
