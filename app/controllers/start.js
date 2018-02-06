import Ember from 'ember';
import DS from 'ember-data';
import NavigablePaneController from '../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    routeName:"start.index",
    equipment: Ember.inject.service('equipment'),
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    messagesController:Ember.inject.controller('messages'),
    pannelTitle:"最新加油单",
    isActive:true,
    selection:null,
    isScanner:Ember.computed("sessionController.isBillScannerPowered",function(){
        return this.get("sessionController.isBillScannerPowered");
    }),
    isFolded:Ember.computed("sessionController.isSystemPowered","sessionController.isManagePowered",function(){
        return !(this.get("sessionController.isSystemPowered") || this.get("sessionController.isManagePowered"));
    }),
    createdDateSorting: ['created_date:asc','id'],
    modifiedDateSortingDesc: ['modified_date:desc'],
    arrangedResult: Ember.computed.sort('model', 'modifiedDateSortingDesc'),
    cars:Ember.computed(function(){
        return this.store.peekAll("car");
    }),
    carsCount:Ember.computed("cars.length",function(){
        return this.get("cars.length");
    }),
    isOptimizable:Ember.computed.not("isScanner"),
    isOptimized:false,
    isOptimizing:false,
    optimizerHelpInfo:"点击可结束过期申请单，并闲置临时车辆，这将优化系统资源并有助于提高系统响应速度。",
    optimizedMessage:"",
    errors:DS.Errors.create(),
    actions:{
        fold(){
        	this.toggleProperty('isFolded');
        },
        oneTouchOptimize(){
            if(!this.get("isOptimizable") || this.get("isOptimized")){
                return;
            }
            this.get("errors").remove("server_side_error");
            this.set("isOptimizing",true);
            let currentUser = this.get("sessionController.user");
            let prom = this.store.createRecord("optimizer",{
                creater: currentUser,
                created_date:new Date()
            }).save();
            prom.then((answer)=>{
                let store = this.store;
                store.unloadAll("optimizer");
                let all_cars_count = answer.get("all_cars_count");
                let archived_cars_count = answer.get("archived_cars_count");
                let archived_instances_count = answer.get("archived_instances_count");
                this.set("optimizedMessage",`已成功执行优化，目前一共有${all_cars_count}辆车，本次优化结束了${archived_instances_count}个申请单，闲置了${archived_cars_count}辆车。`);
                if(archived_cars_count === 0 && archived_instances_count === 0){
                    this.set("isOptimized",true);
                }
                this.send("unloadArchiveds");
                Ember.run.next(()=>{
                    this.set("isOptimizing",false);
                });
            }, (reason)=>{
                let store = this.store;
                store.unloadAll("optimizer");
                if(reason.errors){
                    let error = reason.errors.objectAt(0);
                    let errorMsg = error.detail;
                    let recordErrors = this.get("errors");
                    recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                }
                this.set("isOptimizing",false);
            });
        }
    }
});
