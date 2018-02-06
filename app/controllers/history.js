import Ember from 'ember';

export default Ember.Controller.extend({
    routeName:"history.index",
    equipment: Ember.inject.service('equipment'),
    applicationController:Ember.inject.controller('application'),
	sessionController:Ember.inject.controller('session'),
    messagesController:Ember.inject.controller('messages'),
    pannelTitle:"加油单",
    isActive:false,
	isBack:false,
	selection:null,
    isHide:false,
    isPowered:Ember.computed("sessionController.isLogined",function(){
        return this.get("sessionController.isLogined");
    }),
    // runLaterForHide:null,
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
        //当浏览器大小变化造成从手机模式变成非手机模式时需要保证列表中至少有一个选中
        if(this.get("isActive") && this.get("equipment.isNotXs") && this.get("selection") === null){
            this.send("goBills");
        }
    }),
    isBills:Ember.computed('selection', function() {
        return this.get('selection') === 'bills';
    }),
    isReports:Ember.computed('selection', function() {
        return this.get('selection') === 'reports';
    }),
    actions:{
    }
});
