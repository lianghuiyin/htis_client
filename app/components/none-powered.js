import Ember from 'ember';

export default Ember.Component.extend({
	title:"权限缺失",
	tooltip:"您没有权限使用该功能或者您没有登录",
	actions:{
		backAction(){
            this.sendAction('action');
		}
	}
});
