import Ember from 'ember';
import DS from 'ember-data';
var alreadyRun = false;
export function initialize( /* container, application */ ) {
	// application.inject('route', 'foo', 'service:foo');

	if (alreadyRun) {
		return;
	} else {
		alreadyRun = true;
	}
	DS.Model.reopen({
		rollbackAttributes(){
			this._super();
			if(this.get("isRelationshipsChanged")){
				this.rollbackRelations();
			}
		},
		rollbackRelations(){
			let changedRelationships = this.get("changedRelationships");
			changedRelationships.forEach((relationship)=>{
				this.rollbackRelation(relationship);
			});
		},
		rollbackRelation(relationship){
	    	let kind = relationship.relationshipMeta.kind;
        	if(kind === "hasMany"){
				this.set(relationship.key,relationship.manyArray.canonicalState.mapBy("record"));
			}
        	else if(kind === "belongsTo"){
				this.set(relationship.key,relationship.canonicalMembers.list.mapBy("record")[0]);
        	}
			this.send("propertyWasReset");
		},
	    relationshipsDidChange:Ember.observer("isRelationshipsChanged",function(){
	        //由于ember对于belongsTo关联属性在changedAttributes及rollback上有bug
	        //这里通过判断relationships是变化来正确设置其hasDirtyAttributes值
	        if(this.get("isDeleted")){
	        	return;
	        }
	        if(this.get("isRelationshipsChanged")){
	        	this.send('becomeDirty');
	        }
	        else{
	        	this.send("propertyWasReset");
	        }
	    }),
	    hasDirtyAttributesDidChange:Ember.observer("hasDirtyAttributes",function(){
	    	Ember.run.next(()=>{
	    		//以下两种情况会需要hasDirtyAttributes变化时重新计算isRelationshipsChanged
	    		//1、当save请求后台完成后hasDirtyAttributes会变成false，这时需要重新计算isRelationshipsChanged值
	    		//2、当用户修改Attributes造成hasDirtyAttributes属性从true变成false时要重新计算isRelationshipsChanged值
		    	this.notifyPropertyChange("isRelationshipsChanged");
	    	});
	    }),
	    isRelationshipsChanged:Ember.computed(function(){
	        if(this.get("isDeleted")){
	        	return false;
	        }
	        this.set("changedRelationships",[]);
        	let relationships = this.get("_internalModel._relationships");
        	let relationship,isNoneChanged = true;
        	this.eachRelationship((name, descriptor)=>{
        		relationship = relationships.get(descriptor.key);
        		if(this.isRelationshipChanged(relationship)){
        			isNoneChanged = false;
        		}
        	});
        	return !isNoneChanged;
	    }),
	    changedRelationships:[],
	    isRelationshipChanged(relationship){
	    	let kind = relationship.relationshipMeta.kind;
	    	let isChanged = false;
        	if(kind === "hasMany"){
        		let curIds = relationship.manyArray.currentState.mapBy("id").sort();
        		let canonicalIds = relationship.manyArray.canonicalState.mapBy("id").sort();
        		isChanged = curIds.join(",") !== canonicalIds.join(",");
        	}
        	else if(kind === "belongsTo"){
        		let curIds = relationship.members.list.mapBy("id");
        		let canonicalIds = relationship.canonicalMembers.list.mapBy("id");
        		isChanged = curIds.join(",") !== canonicalIds.join(",");
        	}
    		let changedRelationships = this.get("changedRelationships");
    		if(isChanged){
    			changedRelationships.pushObject(relationship);
    		}
    		else{
    			changedRelationships.removeObject(relationship);
    		}
    		return isChanged;
	    },
	    isDeepDirty:false,
	    isDeepValid:true,
	    isUnSavable: Ember.computed("errors.length","errors.server_side_error","isValid","hasDirtyAttributes","isDeepValid","isDeepDirty","isSaving",function(){
	        let errors = this.get("errors");
	        let hasServerSideError = errors.has("server_side_error");
	        let isSaving = this.get("isSaving"),
	            hasDirtyAttributes = this.get("hasDirtyAttributes"),
	            isValid = this.get("isValid"),
	            isDeepDirty = this.get("isDeepDirty"),
	            isDeepValid = this.get("isDeepValid");
	        if(isSaving){
	            return true;
	        }
	        else{
	            if(hasServerSideError && errors.get("length") === 1){
	                //当只有服务器错误的时候允许保存
	                return false;
	            }
	            else{
	                if(hasDirtyAttributes || isDeepDirty){
	                    if(isValid && isDeepValid){
	                        return false;
	                    }
	                    else{
	                        return true;
	                    }
	                }
	                else{
	                    return true;
	                }
	            }

	        }
	    }),
	    save(isSkipVali){
	        if(isSkipVali){
	            return this._super();
	        }
	        //在执行保存前先触发验证函数，只有验证通过才继续保存
	        this.get("errors").remove('server_side_error');
	        this.validate();
	        if(!this.get("isUnSavable")){
	            return this._super();
	        }
	        else{
	            return Ember.RSVP.reject();
	        }
	    },
	    validate(){
	        var model = this;
	        // 这里不可以用notifyAllPropertyChange，
	        // 因为当后台有返回错误的时候，执行model.notifyPropertyChange函数会造成model内属性值全部重置为默认值
	        // 这应该是ember的bug，可以通过手动调用sendEvent来触发model的observes函数
	        // 从而挠过调用notifyAllPropertyChange函数造成的问题
	        Ember.get(model.constructor,"fields").forEach(function(kind,field){
	            // console.log("kind:%@,field:%@".fmt(kind,field));
	            Ember.sendEvent(model,field + ":change",[model,field]);
	            if(kind === "hasMany"){
	                //如果有hasMany字段，则把其每个子记录都执行一次验证
	                //注意每个子记录中如果有hasMany则会继续找到其下层的hasMany并执行对应的validate，不会漏掉
	                model.get(field).forEach(function(item){
	                    item.validate();
	                });
	            }
	        });
	    },
	    notifyAllPropertyChange(){
	        Ember.get(this.constructor,"fields").forEach((kind,field)=>{
	            this.notifyPropertyChange(field);
	        });
	    }
	});
}

export default {
	name: 'reopen-model',
	initialize: initialize
};