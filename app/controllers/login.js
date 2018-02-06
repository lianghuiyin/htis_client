import Ember from 'ember';

export default Ember.Controller.extend({
    routeName:"login.index",
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    passwordDidChange:function(){
    	if(this.get("model.log_password.length")){
            this.get("model.errors").remove('server_side_error');
    	}
    }.observes("model.log_password"),
    actions:{
	    go:function(){
            window.$("audio")[0].play();//因手机上不可以自动播放音乐，所以这里要手动触发一次，以后才会自动播放
            this.get("model").save().then((result)=>{
                Ember.debug(`login success with the user: ${JSON.stringify(result)}`);
                if(result.get("is_passed")){
                    Ember.$("#login").hide();//因为显示加载中的时候登录界面没有立刻消失，所以这里强行移除界面
                    this.get("sessionController").send("login",result,true);
                }
            },(reason)=>{
                Ember.debug(`login fail and throw: ${reason}`);
                this.set("log_password","");
            });
	    }
	}
});
