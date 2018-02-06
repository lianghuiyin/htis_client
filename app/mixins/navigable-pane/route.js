import Ember from 'ember';

export default Ember.Mixin.create({
    controllerName: '',//start.scanning
	parentControllerName:"",//start
    // activate(){
    //     let controller = this.controllerFor(this.controllerName);
    //     let p_controller = this.controllerFor(this.parentControllerName);
    //     if(Ember.$.support.transition){
    //         Ember.run.next(()=>{
    //             //这里要加later的原因是有时next执行得太快没有动画效果
    //             // Ember.run.later(()=>{
    //                 controller.set("isActive",true);
    //                 p_controller.set("isBack",true);
    //             // },100);
    //         });
    //     }
    //     else{
    //         controller.set("isActive",true);
    //         p_controller.set("isBack",true);
    //     }
    //     return this;
    // },
    // deactivate(){
    //     let controller = this.controller;
    //     let p_controller = this.controllerFor(this.parentControllerName);
    //     controller.set("isActive",false);
    //     p_controller.set("isHide",false);
    //     Ember.run.next(()=>{
    //         p_controller.set("isBack",false);
    //     });
    //     return this;
    // },
    activate(){
        let parentControllerName = this.get("parentControllerName");
        if(parentControllerName){
            let p_controller = this.controllerFor(parentControllerName);
            p_controller.set("isBack",true);
        }
        return this;
    },
    deactivate(){
        let controller = this.controller;
        controller.set("isActive",false);
        let parentControllerName = this.get("parentControllerName");
        if(parentControllerName){
            let p_controller = this.controllerFor(parentControllerName);
            p_controller.set("isBack",false);
        }
        return this;
    },
    actions:{
        goBack(){
            this.transitionTo(this.parentControllerName);
        }
    }
});
