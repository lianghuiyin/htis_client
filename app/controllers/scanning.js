import Ember from 'ember';
import DS from 'ember-data';
import NavigablePaneController from '../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    modelName:"scanning",
    routeName:"scanning",
    modelTitle:"扫码",
    pannelTitle:"扫码加油",
    vinCode:"",
    isChecking:false,
    isConfirming:false,
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    fillingController:Ember.inject.controller('scanning.filling'),
    isPowered:Ember.computed("sessionController.isBillScannerPowered",function(){
        return this.get("sessionController.isBillScannerPowered");
    }),
    car:Ember.computed("vinCode",function(){
    	let vinCode = this.get("vinCode").trim();
        this.set("isChecking",true);
    	if(vinCode){
            return this.store.peekAll("car").findBy("vin",vinCode);
    	}
    	else{
            return null;
    	}
    }),
    instances:Ember.computed("car",function(){
    	let car = this.get("car");
    	if(car){
    		let instances = car.get("instances");
            let syncToken = this.get("applicationController.syncToken");
    		return instances.filter((instance)=>{
                if(instance.get("is_released") && !instance.get("is_archived") && instance.get("is_enable") && !instance.get("isFinished")){
                    // if(instance.get("end_date").getTime() - syncToken.getTime() < 0 || instance.get("start_date").getTime() - syncToken.getTime() > 0){
                    if(syncToken.getTime() > instance.get("end_date").getTime()){
                        //过期不能加油
                        return false;
                    }
                    else if(syncToken.getTime() < instance.get("start_date").getTime()){
                        //没到时间不能加油
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    return false;
                }
    		});
    	}
    	else{
    		return [];
    	}
    }),
    instance:null,
    instancesDidChange:Ember.observer("instances","vinCode",function(){
		let instances = this.get("instances");
		if(instances.get("length") === 1){
			this.set("instance",instances.objectAt(0));
		}
        else{
            this.set("instance",null);
            if(instances.get("length") > 1){
                this.set("isConfirming",true);
            }
        }
        this.set("isChecking",false);
    }),
    instanceDidChange:Ember.observer("instance",function(){
		let instance = this.get("instance");
		if(instance){
            this.get("fillingController").set("oils",instance.get("oils"));
            //加run.next的目的是提高性能，防止在低性能手机上显示不出oils
            Ember.run.next(()=>{
                //this.get("vinCode")加这个原因是手机上卡的话，会报goFilling不存在错误
                if(this.get("vinCode")){
                    this.send("goFilling");
                }
            });
		}
    }),
    errors:Ember.computed("vinCode","car","instances.length","instance",function(){
    	let errors = DS.Errors.create();
    	if(this.get("vinCode.length") === 0){
    		return errors;
    	}
    	if(this.get("car")){
    		if(this.get("instances.length") === 0 || !this.get("instance")){
	    		errors.add("check_errors","该车辆没有权限加油");
    		}
    	}
    	else{
    		errors.add("check_errors","车辆不存在");
    	}
		return errors;
    }),
    actions:{
        clearError(){
            this.set("vinCode","");
            this.get("errors").clear();
        },
        tryGoNext(){
            this.notifyPropertyChange("vinCode");
        },
        cancelConfirming(){
            this.set("vinCode","");
            this.set("isConfirming",false);
        },
        selInstance(instance){
            this.set("instance",instance);
        }
    }
});
