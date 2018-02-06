import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["alert","alert-warning"],
	attributeBindings:["role"],
	role:"alert",
	actions:{
		ok(){
            this.sendAction('action',true);
		},
		cancel(){
            this.sendAction('action',false);
		}
	}
});
