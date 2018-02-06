import Ember from 'ember';
import NavigablePaneRoute from '../../mixins/navigable-pane/route';

export default Ember.Route.extend(NavigablePaneRoute,{
    controllerName: 'scanning.filling',
	parentControllerName:"scanning",
    model(){
        let p_controller = this.controllerFor(this.parentControllerName);
        let car = p_controller.get("car");
        let instance = p_controller.get("instance");
        if(car && instance){
            let currentUser = p_controller.get("sessionController.user");
            let oil = instance.get("oils.firstObject");
            let project = instance.get("project");
            let department = instance.get("department");
            return this.store.createRecord("bill",{
                car:car,
                instance:instance,
                project:project,
                department:department,
                oil:oil,
                oiler:currentUser,
                time:new Date(),
                creater:currentUser,
                created_date:new Date()
            });
        }
        else{
            return null;
        }
    },
    afterModel(model, transition) {
        if(!model){
            transition.send("goBack");
        }
    },
    activate(){
        let controller = this.controllerFor(this.controllerName);
        controller.send("resetOptions");
        return this._super();
    },
    deactivate(){
        let controller = this.controller;
        let model = controller.get("model");
        let signature = controller.get("signature");
        if(signature){
            if(signature.get("isNew")){
                //如果有签字没有提交，则撤销签字
                controller.send("cancelSigning");
            }
            else{
                //如果有签字但已提交，则还原签字为null
                controller.set("signature",null);
            }
        }
        if(model && model.get("isNew")){
            //如果model没有保存成功，说明很可能中途用户放弃该加油单，则需要同时删除其对应的签字
            controller.send("resetSignature");
        }
        if(model){
            model.rollbackAttributes();
        }
        return this._super();
    },
    actions:{
        willTransition(transition) {
            let p_controller = this.controllerFor(this.parentControllerName);
            p_controller.set("vinCode","");
            p_controller.set("isChecking",false);
            p_controller.set("isConfirming",false);

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
            return true;
        },
        goBack(){
            this.transitionTo(this.parentControllerName);
            Ember.run.next(()=>{
                window.$("input").focus();
            });
        }
    }
});
