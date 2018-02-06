import Ember from 'ember';

export default Ember.Controller.extend({
    routeName:"setting.users.user.resetpwd",
    pannelTitle:"重置密码",
    isServerSideErrorDidChange:Ember.observer("model.errors.server_side_error.length",function(){
        if(this.get("model.errors.server_side_error.length")){
            this.set("isPickingError",true);
        }
    }),
    actions:{
        save:function(){
            this.get('model').save().then(()=>{
                this.send("goIndex");
            }, ()=>{
            });
        },
    	cancel(){
	    	this.send("goIndex");
    	},
        clearPop(){
            this.set("isPickUpPopActive",false);
        },
        clearError(model){
            this.set("isPickUpPopActive",false);
            model.get("errors").remove("server_side_error");
        }
    }
});
