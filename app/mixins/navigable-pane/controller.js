import Ember from 'ember';

export default Ember.Mixin.create({
	isActive:false,
	isBack:false,
    isHide:false,
    // runLaterForHide:null,
    isPickUpPopActive:false,
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
    actions:{
        clearPop(){
            this.set("isPickUpPopActive",false);
        }
    }
});
