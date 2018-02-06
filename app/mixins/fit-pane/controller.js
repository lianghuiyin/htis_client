import Ember from 'ember';

export default Ember.Mixin.create({
    equipment: Ember.inject.service('equipment'),
	isActive:false,
	isBack:false,
    isHide:false,
    // runLaterForHide:null,
    parentRouteName:"setting",
    parentController:Ember.inject.controller('setting'),
    // isBackDidChange:Ember.observer("isBack",function(){
    //     //退出后要把div隐藏来减少内存消耗
    //     if(this.get("isBack")){
    //         if(Ember.$.support.transition){
    //             Ember.run.cancel(this.runLaterForHide);
    //             this.runLaterForHide = Ember.run.later(()=>{
    //                 if(this.get("isBack")){
    //                     this.set("isHide",true);
    //                 }
    //             },3000);
    //         }
    //         else{
    //             this.set("isHide",true);
    //         }
    //     }
    // }),
    equipmentIsXsDidChange:Ember.observer("equipment.isXs",function(){
        //当浏览器大小在手机模式与非手机模式中变换时需要做调整来自动适应布局
        if(this.get("equipment.isXs")){
            let currentRouteName = this.target.currentRouteName;
            let isChildRoute = currentRouteName.indexOf(this.parentRouteName) >= 0 && currentRouteName !== `${this.parentRouteName}.index`;
            if(isChildRoute && !this.get("parentController.isBack")){
                this.set("parentController.isBack",true);
            }
        }
        else{
            if(this.get("parentController.isBack")){
                this.set("parentController.isHide",false);
                this.set("parentController.isBack",false);
            }
        }
    })
});
