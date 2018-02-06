import Ember from 'ember';

export default Ember.Controller.extend({
    routeName:"setting.index",
    equipment: Ember.inject.service('equipment'),
    applicationController:Ember.inject.controller('application'),
	sessionController:Ember.inject.controller('session'),
    messagesController:Ember.inject.controller('messages'),
    pannelTitle:"系统设置",
    isActive:false,
	isBack:false,
	selection:null,
    isHide:false,
    isPowered:Ember.computed("sessionController.isSystemPowered",function(){
        return this.get("sessionController.isSystemPowered");
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
            this.send("goRoles");
        }
    }),
    isRoles:Ember.computed('selection', function() {
        return this.get('selection') === 'roles';
    }),
    isUsers:Ember.computed('selection', function() {
        return this.get('selection') === 'users';
    }),
    isProjects:Ember.computed('selection', function() {
        return this.get('selection') === 'projects';
    }),
    isDepartments:Ember.computed('selection', function() {
        return this.get('selection') === 'departments';
    }),
    isOils:Ember.computed('selection', function() {
        return this.get('selection') === 'oils';
    }),
    isPreference:Ember.computed('selection', function() {
        return this.get('selection') === 'preference';
    }),
    actions:{
    }
});
