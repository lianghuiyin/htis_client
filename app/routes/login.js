import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var isLogined = this.controllerFor("session").get("isLogined");
        if(isLogined){
            this.replaceWith('start');
        }
    },
    model:function(){
    	return this.store.createRecord("login",{
        });
    },
    deactivate:function(){
        //把所有用于交互的临时数据删除
        Ember.run.next(()=>{
            this.store.unloadAll("login");
        });
        return this;
    }
});
