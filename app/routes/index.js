import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var isLogined = this.controllerFor("session").get("isLogined");
        if(isLogined){
        	//这里如果用transitionTo，则浏览器返回上一页会有bug，即永远只能进入start或login，而不能返回到真正的上一页
            this.replaceWith('start');
        }
        else{
            this.transitionTo('login');
        }
    }
});
