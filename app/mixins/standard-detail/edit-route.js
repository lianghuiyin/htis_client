import Ember from 'ember';

export default Ember.Mixin.create({
    controllerName: '',//setting.roles.role
    activate(){
        var controller = this.controllerFor(this.controllerName);
        controller.set("isEditing",true);
        controller.set("isNew",false);
        return this;
    },
    deactivate(){
        var controller = this.controller;
        controller.set("isEditing",false);
        controller.set("isNew",false);
        var model = controller.get("model");
        //这里要增加删除的判断，是因为如果该记录被其他用户删除然后push过来的话，rollbackAttributes会把删除的记录撤销
        if(model && !model.get("isDeleted")){
            model.rollbackAttributes();
        }
        return this;
    },
    actions:{
        willTransition(transition) {
            let controller = this.get("controller");
            controller.set("confirmCancelTransition",null);
            controller.set("isConfirmingCancel",false);
            if(controller.get("isConfirmed")){
                controller.set("isConfirmed",false);
                return true;
            }
            else if(controller.get("model.hasDirtyAttributes") && !controller.get("model.isDeleted")){
                //这里要判断isDeleted，是因为changeset给push过来的删除记录hasDirtyAttributes为true
                controller.send("showCancelConfirm",transition);
                transition.abort();
            }
            else{
                return true;
            }
        },
        goIndex(){
            this.transitionTo(this.controllerName);
        }
    }
});
