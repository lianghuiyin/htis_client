import Ember from 'ember';

export default Ember.Mixin.create({
    controllerName: '',//setting.roles
    parentControllerName:"",//setting
    isDeep:false,//是否为深度界面，深度界面即最深层里面的界面，其在手机及PC上动画表现一致，不需要特意去兼容PC上的多屏展开模式与手机上的多层折叠模式
    activate(){
        let isDeep = this.get("isDeep");
        if(!isDeep){
            //在多屏模式下，因为在切换列表选项的时候详情界面不会触发didInsertElement，所以需要额外增加isActive设值步骤
            //而且多屏模式下不需要看到动画
            let controller = this.controllerFor(this.controllerName);
            if(!controller.get("equipment.isXs")){
                controller.set("isActive",true);
            }
        }
        let parentControllerName = this.get("parentControllerName");
        if(parentControllerName){
            let p_controller = this.controllerFor(parentControllerName);
            if(isDeep){
                p_controller.set("isBack",true);
            }
            else{
                if(p_controller.get("equipment.isXs")){
                    p_controller.set("isBack",true);
                }
            }
        }
        return this;
    },
    deactivate(){
        let controller = this.controller;
        controller.set("isActive",false);
        let parentControllerName = this.get("parentControllerName");
        if(parentControllerName){
            let p_controller = this.controllerFor(parentControllerName);
            let isDeep = this.get("isDeep");
            if(isDeep){
                p_controller.set("isBack",false);
            }
            else{
                if(p_controller.get("equipment.isXs")){
                    p_controller.set("isBack",false);
                }
            }
        }
        return this;
    }
});
