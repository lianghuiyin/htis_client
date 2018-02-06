import Ember from 'ember';
import FitPaneRoute from '../../mixins/fit-pane/route';

export default Ember.Mixin.create(FitPaneRoute,{
    controllerName: '',//setting.roles.role
    parentControllerName:"",//setting.roles
    renderTemplate(controller) {
        this.render(this.controllerName,{ controller: controller });
    },
    model(){
        return this.controllerFor(this.parentControllerName).createRecord();
    },
    activate(){
        let controller = this.controllerFor(this.controllerName);
        controller.set("isEditing",true);
        controller.set("isNew",true);
        controller.set("isConfirmingCancel",false);
        return this._super();
    },
    deactivate(){
        let controller = this.controller;
        controller.set("isEditing",false);
        controller.set("isNew",false);
        controller.set("isConfirmingCancel",false);
        var model = controller.get("model");
        if(model){
            model.rollbackAttributes();
        }
        return this._super();
    },
    actions:{
        willTransition(transition) {
            this.set("controller.confirmCancelTransition",null);
            if(this.get("controller.isConfirmed")){
                this.set("controller.isConfirmed",false);
                return true;
            }
            else if(this.get("controller.model.hasDirtyAttributes")){
                this.controller.send("showCancelConfirm",transition);
                transition.abort();
            }
            else{
                return true;
            }
        },
        goBack(){
            this.transitionTo(this.parentControllerName);
        }
    }
});
