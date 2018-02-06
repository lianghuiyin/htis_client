import Ember from 'ember';

export default Ember.Controller.extend({
    routeName:"manage.index",
    equipment: Ember.inject.service('equipment'),
    applicationController:Ember.inject.controller('application'),
	sessionController:Ember.inject.controller('session'),
    messagesController:Ember.inject.controller('messages'),
    pannelTitle:"加油管理",
    isActive:false,
	isBack:false,
	selection:null,
    isHide:false,
    isPowered:Ember.computed("sessionController.isManagePowered",function(){
        return this.get("sessionController.isManagePowered");
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
            this.send("goPendings");
        }
    }),
    isSearchs:Ember.computed('selection', function() {
        return this.get('selection') === 'searchs';
    }),
    isPendings:Ember.computed('selection', function() {
        return this.get('selection') === 'pendings';
    }),
    isUnuseds:Ember.computed('selection', function() {
        return this.get('selection') === 'unuseds';
    }),
    isReleases:Ember.computed('selection', function() {
        return this.get('selection') === 'releases';
    }),
    isDisables:Ember.computed('selection', function() {
        return this.get('selection') === 'disables';
    }),
    isArchives:Ember.computed('selection', function() {
        return this.get('selection') === 'archives';
    }),
    createRecord(){
        let currentUser = this.get("sessionController.user");
        let car = this.store.createRecord("car", {
            number: `New-Number`,
            vin:'',
            description: '',
            creater: currentUser,
            created_date: new Date(),
            modifier: currentUser,
            modified_date: new Date()
        });
        return car;
    },
    actions:{
    }
});
