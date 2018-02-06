import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["pick-up-pop","trans-all-02"],
	isPicking:false,
    isActive:false,
    isAlert:false,
    isNoneAnimation:false,
    init(){
        this._super();
        if(Ember.$.support.transition && !this.get("isNoneAnimation")){
            Ember.run.next(()=>{
                // Ember.run.later(()=>{
                    if(this && !this.get("isDestroyed")){
                        this.set("isActive",true);
                    }
                // },100);
            });
        }
        else{
            this.set("isActive",true);
            Ember.run.next(()=>{
               if(this && !this.get("isDestroyed")){
                    this.notifyPropertyChange("isActive");
                }
            });
        }
    },
    isActiveDidChange:Ember.observer("isActive",function(){
    	if(this.get("isActive")){
    		return;
    	}
        if(Ember.$.support.transition && !this.get("isNoneAnimation")){
            Ember.run.next(()=>{
                // Ember.run.later(()=>{
                   if(this && !this.get("isDestroyed")){
                        this.set("isPicking",false);
                    }
                // },100);
            });
        }
        else{
            Ember.run.next(()=>{
               if(this && !this.get("isDestroyed")){
                    this.set("isPicking",false);
                    this.notifyPropertyChange("isPicking");
                }
            });
        }

    }),
    willDestroy:function(){
        //因为离开时pick-up-pop控件无法通过isActive属性来同步isPicking属性（即无法触发上面的observer函数isActiveDidChange），
        //所以需要手动判断并设置为false
        if(this.get("isPicking")){
            this.set("isPicking",false);
        }
    },
	actions:{
		clearPop(){
            this.set("isPicking",false);
		}
	}
});
